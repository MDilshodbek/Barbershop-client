import { getJwtToken } from '../libs/auth';
import { chatStatusVar, socketVar } from './store';
import {
	AI_BOT_ID,
	AI_BOT_MEMBER,
	CHAT_COOLDOWN_MS,
	CHAT_MAX_LENGTH,
	ChatMember,
	ChatMessage,
	chatErrorVar,
	chatIsTypingVar,
	chatIsWaitingVar,
	chatLastSentAtVar,
	chatLastSentTextVar,
	chatMessagesVar,
	createLocalChatId,
} from './chatStore';

const RECONNECT_BASE_DELAY = 1000;
const RECONNECT_MAX_DELAY = 30000;

let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;

export type SendChatResult =
	| { sent: true }
	| { sent: false; reason: 'empty' | 'tooLong' | 'waiting' | 'cooldown' | 'notConnected' };

// Comment: streamed chunks are batched per animation frame (leading edge): the first chunk after a paint is
// applied right away, and chunks that arrive before the next paint are merged into one update at that paint
const pendingChunks = new Map<string, string>(); // id -> text not yet applied
let chunkFrame: number | null = null; // set while an update is waiting to be painted

function cancelChunkFrame() {
	if (chunkFrame !== null) {
		cancelAnimationFrame(chunkFrame);
		chunkFrame = null;
	}
}

/** Every new socket is a new AI session on the backend, so start from a clean chat */
function resetChatSession() {
	cancelChunkFrame();
	pendingChunks.clear();
	chatMessagesVar([]);
	chatIsTypingVar(false);
	chatIsWaitingVar(false);
	chatErrorVar(null);
}

function finishStreamingMessages() {
	const list = chatMessagesVar();
	if (!list.some((m) => m.streaming)) return;
	chatMessagesVar(list.map((m) => (m.streaming ? { ...m, streaming: false } : m)));
}

function stopWaiting() {
	flushChunks();
	chatIsTypingVar(false);
	chatIsWaitingVar(false);
	finishStreamingMessages();
}

function isChatMember(value: any): value is ChatMember {
	return !!value && typeof value === 'object' && typeof value._id === 'string';
}

/** Returns a new list with the chunk applied; unchanged messages keep their identity (memoized rows skip them) */
function applyAiChunk(list: ChatMessage[], id: string, text: string): ChatMessage[] {
	const index = list.findIndex((m) => m.id === id);

	if (index === -1) {
		const message: ChatMessage = { id, text, role: 'bot', memberData: AI_BOT_MEMBER, streaming: true };
		return [...list, message];
	}

	// Comment: aiDone already finalized this reply; ignore late chunks
	if (!list[index].streaming) return list;
	return list.map((m, i) => (i === index ? { ...m, text: m.text + text } : m));
}

/** Applies all buffered chunks in one store update, reading the CURRENT list so nothing is lost or duplicated */
function flushChunks() {
	cancelChunkFrame();
	if (!pendingChunks.size) return;

	let list = chatMessagesVar();
	pendingChunks.forEach((text, id) => {
		list = applyAiChunk(list, id, text);
	});
	pendingChunks.clear();
	chatMessagesVar(list);
}

function appendAiChunk(id: string, text: string) {
	pendingChunks.set(id, (pendingChunks.get(id) ?? '') + text);
	// Comment: an update is already waiting for the next paint; this chunk joins it
	if (chunkFrame !== null) return;

	flushChunks();
	chunkFrame = requestAnimationFrame(() => {
		chunkFrame = null;
		flushChunks();
	});
}

function finishAiReply(id: string, text: string, memberData: ChatMember) {
	const list = chatMessagesVar();
	const index = list.findIndex((m) => m.id === id);
	const message: ChatMessage = { id, text, role: 'bot', memberData, streaming: false };

	if (index === -1) chatMessagesVar([...list, message]);
	else chatMessagesVar(list.map((m, i) => (i === index ? { ...m, ...message } : m)));
}

function handleChatFrame(raw: unknown) {
	if (typeof raw !== 'string') {
		console.warn('Chat: skipped non-text frame');
		return;
	}

	let data: any;
	try {
		data = JSON.parse(raw);
	} catch (err) {
		console.warn('Chat: skipped invalid JSON frame', raw);
		return;
	}

	if (!data || typeof data !== 'object' || typeof data.event !== 'string') {
		console.warn('Chat: skipped frame without event', data);
		return;
	}

	// Comment: any other event must see every chunk that arrived before it, so apply the buffer first
	if (data.event !== 'aiChunk') flushChunks();

	switch (data.event) {
		case 'getMessages': {
			if (!Array.isArray(data.list)) break;
			const list: ChatMessage[] = data.list
				.filter((item: any) => item && typeof item.text === 'string')
				.map((item: any): ChatMessage => ({
					id: createLocalChatId(),
					text: item.text,
					role: 'bot',
					memberData: isChatMember(item.memberData) ? item.memberData : AI_BOT_MEMBER,
					streaming: false,
				}));
			chatMessagesVar(list);
			break;
		}
		case 'message': {
			if (typeof data.text !== 'string') break;
			const memberData: ChatMember | null = isChatMember(data.memberData) ? data.memberData : null;
			// Comment: only the bot id is a bot message; any other member (or null for Guests) is our own echo
			const message: ChatMessage = {
				id: createLocalChatId(),
				text: data.text,
				role: memberData?._id === AI_BOT_ID ? 'bot' : 'user',
				memberData,
				streaming: false,
			};
			chatMessagesVar([...chatMessagesVar(), message]);
			break;
		}
		case 'typing': {
			const isTyping = data.isTyping === true;
			chatIsTypingVar(isTyping);
			if (!isTyping) stopWaiting();
			break;
		}
		case 'aiChunk': {
			if (typeof data.id !== 'string' || typeof data.text !== 'string') break;
			appendAiChunk(data.id, data.text);
			break;
		}
		case 'aiDone': {
			if (typeof data.id !== 'string' || typeof data.text !== 'string') break;
			finishAiReply(data.id, data.text, isChatMember(data.memberData) ? data.memberData : AI_BOT_MEMBER);
			break;
		}
		case 'error': {
			chatErrorVar({ id: createLocalChatId(), text: typeof data.text === 'string' ? data.text : '' });
			chatIsWaitingVar(false);
			break;
		}
		default:
			console.warn('Chat: skipped unknown event', data.event);
	}
}

// Comment: Build websocket url safely for both local and production
export function getWebSocketUrl(): string {
	const envWs = process.env.REACT_APP_API_WS;

	// Comment: If env is a full ws:// or wss:// URL, use it directly (local dev)
	if (envWs && (envWs.startsWith('ws://') || envWs.startsWith('wss://'))) {
		return envWs;
	}

	// Comment: If env is a relative path like "/ws", build from current domain
	if (envWs && envWs.startsWith('/')) {
		const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
		return `${protocol}://${window.location.host}${envWs}`;
	}

	// Comment: Fallback:
	// - On localhost, use local backend websocket
	// - On real domain, always use nginx websocket path "/ws"
	const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

	if (window.location.hostname === 'localhost') {
		return `${protocol}://localhost:3007`;
	}

	return `${protocol}://${window.location.host}/ws`;
}

function buildSocketUrl(): string {
	const url = getWebSocketUrl();
	const token = getJwtToken();
	if (!token) return url;

	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}token=${encodeURIComponent(token)}`;
}

function clearReconnectTimer() {
	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}
}

function scheduleReconnect() {
	clearReconnectTimer();
	const delay = Math.min(RECONNECT_BASE_DELAY * 2 ** reconnectAttempts, RECONNECT_MAX_DELAY);
	reconnectAttempts += 1;
	console.log(`WebSocket reconnecting in ${delay}ms`);
	reconnectTimer = setTimeout(() => {
		reconnectTimer = null;
		connectChatSocket();
	}, delay);
}

/** Opens the chat socket. Does nothing during SSR or if a socket is already connecting/open. */
export function connectChatSocket() {
	if (typeof window === 'undefined') return;
	if (socket) return;

	clearReconnectTimer();

	const ws = new WebSocket(buildSocketUrl());
	socket = ws;
	socketVar(ws);
	chatStatusVar('connecting');

	ws.addEventListener('open', () => {
		if (ws !== socket) return;
		reconnectAttempts = 0;
		resetChatSession();
		chatStatusVar('open');
		console.log('WebSocket connection!');
	});

	ws.addEventListener('message', (msg) => {
		console.log('WebSocket message:', msg.data);
		if (ws !== socket) return;
		handleChatFrame(msg.data);
	});

	ws.addEventListener('error', (error) => {
		console.log('WebSocket error:', error);
	});

	ws.addEventListener('close', () => {
		// Comment: Intentional closes detach the socket first, so only unexpected closes reach here
		if (ws !== socket) return;
		socket = null;
		socketVar(null);
		chatStatusVar('closed');
		stopWaiting();
		scheduleReconnect();
	});
}

/** Closes the chat socket on purpose; no automatic reconnect follows. */
export function disconnectChatSocket() {
	clearReconnectTimer();
	reconnectAttempts = 0;

	const ws = socket;
	socket = null;
	socketVar(null);
	chatStatusVar('closed');
	stopWaiting();

	if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
		ws.close(1000, 'client disconnect');
	}
}

/** Closes the current socket and opens a new one with a freshly read token. */
export function reconnectChatSocket() {
	disconnectChatSocket();
	connectChatSocket();
}

/** The single place that sends chat messages. The server echo adds it to the list. */
export function sendChatMessage(text: string): SendChatResult {
	const trimmed = text.trim();
	if (!trimmed) return { sent: false, reason: 'empty' };
	if (trimmed.length > CHAT_MAX_LENGTH) return { sent: false, reason: 'tooLong' };
	if (chatIsWaitingVar()) return { sent: false, reason: 'waiting' };

	const lastSentAt = chatLastSentAtVar();
	if (lastSentAt !== null && Date.now() - lastSentAt < CHAT_COOLDOWN_MS) return { sent: false, reason: 'cooldown' };

	if (!socket || socket.readyState !== WebSocket.OPEN) return { sent: false, reason: 'notConnected' };

	socket.send(JSON.stringify({ event: 'message', data: trimmed }));
	chatIsWaitingVar(true);
	chatLastSentAtVar(Date.now());
	chatLastSentTextVar(trimmed);
	return { sent: true };
}
