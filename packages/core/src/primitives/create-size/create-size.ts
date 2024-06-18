/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/blob/main/packages%2Futils%2Fsrc%2Fcreate%2Fsize.ts
 */

import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export function createSize(ref: Accessor<HTMLElement | undefined>) {
	const [height, setHeight] = createSignal(0);
	const [width, setWidth] = createSignal(0);

	createEffect(() => {
		const element = ref();
		if (!element) return;

		syncSize(element);

		const observer = new ResizeObserver(resizeObserverCallback);
		observer.observe(element);
		onCleanup(() => {
			observer.disconnect();
		});
	});

	const resizeObserverCallback = (entries: ResizeObserverEntry[]) => {
		for (const entry of entries) {
			if (entry.target !== ref()) continue;
			syncSize(entry.target as HTMLElement);
		}
	};

	const syncSize = (element: HTMLElement) => {
		setWidth(element.offsetWidth);
		setHeight(element.offsetHeight);
	};

	return {
		width,
		height,
	};
}
