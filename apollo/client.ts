import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, split, from, NormalizedCacheObject } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { getJwtToken } from '../libs/auth';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { socketVar } from './store';
let apolloClient: ApolloClient<NormalizedCacheObject>;

function getHeaders() {
	const headers = {} as HeadersInit;
	const token = getJwtToken();
	// @ts-ignore
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		return true;
	}, // @ts-ignore
	fetchAccessToken: () => {
		// execute refresh token
		return null;
	},
});

// Comment: Build websocket url safely for both local and production
function getWebSocketUrl(): string {
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
		return `${protocol}://localhost:4001`;
	}

	return `${protocol}://${window.location.host}/ws`;
}

// Custome websocket clinet
class LoggingWebSocket {
	private socket: WebSocket;

	constructor(url: string) {
		const token = getJwtToken();
		const separator = url.includes('?') ? '&' : '?';
		const fullUrl = token ? `${url}${separator}token=${token}` : url;

		this.socket = new WebSocket(fullUrl);
		socketVar(this.socket);

		this.socket.onopen = () => {
			console.log('WebSocket connection!');
		};

		this.socket.onmessage = (msg) => {
			console.log('WebSocket message:', msg.data);
		};

		this.socket.onerror = (error) => {
			console.log('WebSocket error:', error);
		};
	}

	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		this.socket.send(data);
	}

	close() {
		this.socket.close();
	}
}

function createIsomorphicLink() {
	const authLink = new ApolloLink((operation, forward) => {
		operation.setContext(({ headers = {} }) => ({
			headers: {
				...headers,
				...getHeaders(),
			},
		}));
		console.warn('requesting.. ', operation);
		return forward(operation);
	});

	// @ts-ignore
	const link = new createUploadLink({
		uri: process.env.REACT_APP_API_GRAPHQL_URL,
	});

	if (typeof window !== 'undefined') {
		/* WEBSOCKET SUBSCRIPTION LINK */
		const wsLink = new WebSocketLink({
			// Comment: Always use ws/wss that matches the current page protocol.
			uri: getWebSocketUrl(),
			options: {
				reconnect: false,
				timeout: 30000,
				connectionParams: () => {
					return { headers: getHeaders() };
				},
			},
			webSocketImpl: LoggingWebSocket,
		});

		const errorLink = onError(({ graphQLErrors, networkError, response }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message, locations, path, extensions }) => {
					console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
					if (!message.includes('input')) sweetErrorAlert(message);
				});
			}
			if (networkError) console.log(`[Network error]: ${networkError}`);
			// @ts-ignore
			if (networkError?.statusCode === 401) {
			}
		});

		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
			},
			wsLink,
			authLink.concat(link),
		);

		return from([errorLink, tokenRefreshLink, splitLink]);
	}

	// Comment: no window during SSR — skip the websocket/error-alert link setup
	// (there's no UI to alert) but still return a real link so Apollo Client
	// doesn't fall back to its deprecated default-link behavior.
	return authLink.concat(link);
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
