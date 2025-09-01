/** @format */

export const FAVORITES_KEY = "favorites";

export const getFavorites = (): string[] => {
	try {
		const raw = localStorage.getItem(FAVORITES_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as string[]) : [];
	} catch {
		return [];
	}
};

export const setFavorites = (ids: string[]) => {
	try {
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
	} catch {
		/* no-op */
	}
};

export const isFavorite = (id: string): boolean => {
	return getFavorites().includes(id);
};

export const toggleFavorite = (id: string): string[] => {
	const current = getFavorites();
	const next = current.includes(id)
		? current.filter((favId) => favId !== id)
		: [...current, id];
	setFavorites(next);
	return next;
};
