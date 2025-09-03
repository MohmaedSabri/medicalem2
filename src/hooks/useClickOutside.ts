/** @format */

import { useEffect, useRef } from "react";

/**
 * Custom hook to handle click outside functionality
 * @param callback - Function to call when clicking outside
 * @param enabled - Whether the hook is enabled (default: true)
 */
export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
	callback: () => void,
	enabled: boolean = true
) => {
	const ref = useRef<T>(null);

	useEffect(() => {
		if (!enabled) return;

		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		// Add event listeners for both mouse and touch events
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [callback, enabled]);

	return ref;
};
