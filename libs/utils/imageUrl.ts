import { REACT_APP_API_URL } from '../config';

/**
 * Resolves an image path to a usable URL.
 * - absolute URLs (http, https, protocol-relative, data, blob) are returned unchanged
 * - paths starting with "/" are frontend static files (public/) and are returned unchanged
 * - anything else is a backend-relative upload path and gets the REACT_APP_API_URL prefix
 */
export function getImageUrl(path?: string | null): string {
	if (!path) return '';
	if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
	if (path.startsWith('/')) return path;

	const base = REACT_APP_API_URL.replace(/\/+$/, '');
	return `${base}/${path.replace(/^\/+/, '')}`;
}
