/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/drawer
 */

import { combineStyle } from "@solid-primitives/props";
import type { JSX, ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";
import {
	DialogOverlay,
	type DialogOverlayCommonProps,
	type DialogOverlayOptions,
	type DialogOverlayRenderProps,
} from "../dialog/dialog-overlay";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useDrawerInternalContext } from "./drawer-context";

export interface DrawerOverlayOptions extends DialogOverlayOptions {}

export interface DrawerOverlayCommonProps<T extends HTMLElement = HTMLElement>
	extends DialogOverlayCommonProps<T> {
	style: JSX.CSSProperties | string;
}

export interface DrawerOverlayRenderProps
	extends DrawerOverlayCommonProps,
		DialogOverlayRenderProps {
	"data-closing": "" | undefined;
	"data-transitioning": "" | undefined;
}

export type DrawerOverlayProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DrawerOverlayOptions & Partial<DrawerOverlayCommonProps<ElementOf<T>>>;

/**
 * A layer that covers the inert portion of the view when the drawer is open.
 *
 * Opacity is driven automatically by the drawer's open percentage so it tracks
 * drag gestures in real-time. Add a CSS `transition: opacity` to your overlay
 * element and it will animate on open/close as well.
 *
 * - **Closing**: opacity transitions to 0 via the `data-closing` attribute hook.
 * - **Drag**: opacity tracks `openPercentage` frame-by-frame (no CSS transition
 *   is applied during drag so it feels instant).
 *
 * @data `data-expanded` — present when open (from Dialog)
 * @data `data-closed` — present when closed (from Dialog)
 * @data `data-closing` — present during the close transition
 * @data `data-transitioning` — present during any transition
 */
export function DrawerOverlay<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DrawerOverlayProps<T>>,
) {
	const ctx = useDrawerInternalContext();
	const p = props as DrawerOverlayProps;

	// Opacity is driven by JS so it:
	// • starts at 0 on mount (openPercentage = 0 before the drawer animates in)
	// • tracks the drag position in real-time
	// • goes to 0 when the closing state is entered (before CSS transition fires)
	// If the user supplies a CSS `transition: opacity …` the changes will animate.
	const computedOpacity = () => {
		if (ctx.transitionState() === "closing") return 0;
		return ctx.openPercentage();
	};

	// Disable CSS transition during drag for instant tracking.
	const computedStyle = () =>
		combineStyle(
			{
				opacity: computedOpacity(),
				"transition-duration": ctx.isDragging() ? "0ms" : undefined,
			},
			p.style,
		);

	return (
		<DialogOverlay<any>
			data-closing={ctx.transitionState() === "closing" ? "" : undefined}
			data-transitioning={ctx.isTransitioning() ? "" : undefined}
			{...omit(p, "style")}
			style={computedStyle()}
		/>
	);
}
