import { makeVar } from '@apollo/client';

/** Backend contract: the bot's member _id */
export const AI_BOT_ID = 'ai-assistant';

export interface ChatMember {
	_id: string;
	memberNick: string;
	memberImage: string;
}

export const AI_BOT_MEMBER: ChatMember = {
	_id: AI_BOT_ID,
	memberNick: 'Barber AI',
	memberImage: '/img/ai-bot.png',
};

export const CHAT_MAX_LENGTH = 500;
export const CHAT_COOLDOWN_MS = 2000;

export type ChatRole = 'user' | 'bot';

export interface ChatMessage {
	id: string;
	text: string;
	role: ChatRole;
	memberData: ChatMember | null;
	streaming: boolean;
}

export interface ChatError {
	id: string;
	text: string;
}

export const chatMessagesVar = makeVar<ChatMessage[]>([]);
export const chatIsTypingVar = makeVar<boolean>(false);
export const chatIsWaitingVar = makeVar<boolean>(false);
export const chatLastSentAtVar = makeVar<number | null>(null);
export const chatLastSentTextVar = makeVar<string>('');
export const chatErrorVar = makeVar<ChatError | null>(null);

let localIdCounter = 0;

/** Unique id for messages/errors that don't carry a backend id */
export function createLocalChatId(): string {
	localIdCounter += 1;
	return `local-${Date.now()}-${localIdCounter}`;
}
