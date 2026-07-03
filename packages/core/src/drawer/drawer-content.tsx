/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/drawer
 */

import {
	callHandler,
	createGlobalListeners,
	getScrollParent,
	mergeRefs,
} from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, createEffect, createMemo, omit } from "solid-js";
import {
	DialogContent,
	type DialogContentCommonProps,
	type DialogContentOptions,
	type DialogContentRenderProps,
} from "../dialog/dialog-content";
import { useDialogContext } from "../dialog/dialog-context";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useDrawerInternalContext } from "./drawer-context";
import {
	type DrawerSide,
	findClosestSnapPoint,
	locationIsDraggable,
} from "./drawer-lib";

export interface DrawerContentOptions extends DialogContentOptions {}

export interface DrawerContentCommonProps<T extends HTMLElement = HTMLElement>
	extends DialogContentCommonProps<T> {
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties | string;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onTouchStart: JSX.EventHandlerUnion<T, TouchEvent>;
	onTransitionEnd: JSX.EventHandlerUnion<T, TransitionEvent>;
}

export interface DrawerContentRenderProps
	extends DrawerContentCommonProps,
		DialogContentRenderProps {
	"data-side": DrawerSide;
	"data-opening": "" | undefined;
	"data-closing": "" | undefined;
	"data-snapping": "" | undefined;
	"data-transitioning": "" | undefined;
}

export type DrawerContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DrawerContentOptions & Partial<DrawerContentCommonProps<ElementOf<T>>>;

/**
 * Contains the content rendered when the drawer is open.
 * Handles drag-to-snap and drag-to-dismiss gestures.
 *
 * @data `data-side` — which edge the drawer appears from
 * @data `data-expanded` — present when open
 * @data `data-closed` — present when closed (from Dialog)
 * @data `data-opening` — present during the open transition
 * @data `data-closing` — present during the close transition
 * @data `data-snapping` — present while snapping to a snap point after drag
 * @data `data-transitioning` — present during any transition
 */
export function DrawerContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DrawerContentProps<T>>,
) {
	const p = props as DrawerContentProps;
	const others = omit(
		p,
		"ref",
		"style",
		"onPointerDown",
		"onTouchStart",
		"onTransitionEnd",
		"onOpenAutoFocus",
		"onCloseAutoFocus",
		"onPointerDownOutside",
		"onFocusOutside",
		"onInteractOutside",
	);

	const ctx = useDrawerInternalContext();
	const dialogCtx = useDialogContext();

	// --- Drag tracking ---
	let pointerDown = false;
	let dragStartPos: number | null = null;
	let dragStartTranslate = 0;
	let currentPointerStart: [number, number] = [0, 0];
	let cachedMoveTimestamp = new Date();
	let cachedTranslate = 0;

	// --- ResizeObserver: keep drawerSize in sync ---
	createEffect(
		() => dialogCtx.contentRef(),
		(el) => {
			if (!el) return;
			const measure = () => {
				const size =
					ctx.side() === "left" || ctx.side() === "right"
						? el.offsetWidth
						: el.offsetHeight;
				ctx.setDrawerSize(size);
			};
			measure();
			const obs = new ResizeObserver(measure);
			obs.observe(el);
			return () => obs.disconnect();
		},
	);

	// --- Global pointer/touch listeners (active while dialog is open) ---
	// createGlobalListeners uses onCleanup internally for the outer component lifetime.
	// We manage add/remove ourselves based on isOpen so the listeners are only
	// attached while the drawer is visible.
	const { addGlobalListener, removeAllGlobalListeners } =
		createGlobalListeners();

	createEffect(
		() => dialogCtx.isOpen(),
		(isOpen) => {
			if (isOpen) {
				addGlobalListener(document, "pointermove", onPointerMove);
				addGlobalListener(document, "touchmove", onTouchMove, {
					passive: false,
				});
				addGlobalListener(document, "pointerup", onPointerUp);
				addGlobalListener(document, "touchend", onTouchEnd);
				addGlobalListener(document, "contextmenu", onUp);
			} else {
				removeAllGlobalListeners();
			}
		},
	);

	// --- Transform value for the CSS translate ---
	const transformValue = createMemo(() => {
		const size = ctx.drawerSize();
		// Before ResizeObserver fires, drawerSize is 0. translate() would resolve to 0
		// (resolvePoint(0, 0) = 0), which places the drawer at the visible position and
		// causes a 1-frame flash on first open. Use percentage-based off-screen values
		// instead so the element is guaranteed to start off-screen regardless of size.
		// When size updates (still in neutral transitionState=null, so transition-duration
		// is 0ms), the switch from 100% to the measured px value is visually identical.
		if (size === 0) {
			switch (ctx.side()) {
				case "top":
					return "translate3d(0, -100%, 0)";
				case "bottom":
					return "translate3d(0, 100%, 0)";
				case "right":
					return "translate3d(100%, 0, 0)";
				case "left":
					return "translate3d(-100%, 0, 0)";
			}
		}
		const t = ctx.translate();
		switch (ctx.side()) {
			case "top":
				return `translate3d(0, ${-t}px, 0)`;
			case "bottom":
				return `translate3d(0, ${t}px, 0)`;
			case "right":
				return `translate3d(${t}px, 0, 0)`;
			case "left":
				return `translate3d(${-t}px, 0, 0)`;
		}
	});

	// --- Resolved snap points for the current drawer size ---
	const snapPoints = createMemo(() => ctx.resolvedSnapPoints());

	// --- Drag axis for this side ---
	const dragAxis = createMemo<"x" | "y">(() =>
		ctx.side() === "left" || ctx.side() === "right" ? "x" : "y",
	);

	// ---- Event handlers ----

	const onPointerDown = (event: PointerEvent) => {
		callHandler(event as any, p.onPointerDown as any);
		if (event.button !== 0) return;
		const target = event.target as HTMLElement;
		const content = dialogCtx.contentRef();
		if (!content || !locationIsDraggable(target, content, event.pointerType))
			return;
		if (ctx.transitionState() === "closing") return;

		pointerDown = true;
		if (ctx.handleScrollableElements()) {
			currentPointerStart = [event.clientX, event.clientY];
		}
	};

	const onTouchStart = (event: TouchEvent) => {
		callHandler(event as any, p.onTouchStart as any);
		if (event.touches.length !== 1) return;
		dragStartPos = null;
	};

	const onPointerMove = (event: PointerEvent) =>
		onMove(event.target as HTMLElement, event.clientX, event.clientY);

	const onTouchMove = (event: TouchEvent) => {
		const touch = event.touches[0];
		if (!touch) return;
		onMove(event.target as HTMLElement, touch.clientX, touch.clientY);
	};

	const onMove = (target: HTMLElement, x: number, y: number) => {
		if (!pointerDown) return;

		if (!ctx.isDragging() || dragStartPos === null) {
			// Reject if there's a text selection active
			const sel = window.getSelection();
			if (sel && sel.toString().length > 0) {
				onUp();
				return;
			}

			// Check for scrollable children that should consume this drag
			if (ctx.handleScrollableElements()) {
				const axis = dragAxis();
				const pointerIdx = axis === "x" ? 0 : 1;
				const delta = [x, y][pointerIdx]! - currentPointerStart[pointerIdx]!;

				if (Math.abs(delta) >= 0.3) {
					const content = dialogCtx.contentRef();
					const scrollParent = getScrollParent(target);
					if (content && scrollParent && scrollParent !== content) {
						// If scrollParent is inside the content it might own this drag
						if (content.contains(scrollParent)) {
							const canScroll =
								delta < 0
									? axis === "y"
										? scrollParent.scrollTop > 0
										: scrollParent.scrollLeft > 0
									: axis === "y"
										? scrollParent.scrollHeight - scrollParent.scrollTop >
											scrollParent.clientHeight + 1
										: scrollParent.scrollWidth - scrollParent.scrollLeft >
											scrollParent.clientWidth + 1;
							if (canScroll) {
								onUp();
								return;
							}
						}
					}
				}
			}

			// Lock drag axis
			dragStartPos = dragAxis() === "x" ? x : y;
			dragStartTranslate = ctx.translate();
			cachedMoveTimestamp = new Date();
			cachedTranslate = ctx.translate();

			ctx.setIsDragging(true);
			ctx.setTransitionState(null);
		}

		// translateDelta: how far the translate should move from dragStartTranslate.
		// Positive = toward closed, negative = toward more open.
		let translateDelta = 0;
		switch (ctx.side()) {
			case "top":
				translateDelta = dragStartPos! - y; // drag ↑ (y↓) closes top drawer
				break;
			case "bottom":
				translateDelta = y - dragStartPos!; // drag ↓ (y↑) closes bottom drawer
				break;
			case "right":
				translateDelta = x - dragStartPos!; // drag → (x↑) closes right drawer
				break;
			case "left":
				translateDelta = dragStartPos! - x; // drag ← (x↓) closes left drawer
				break;
		}

		let newTranslate = dragStartTranslate + translateDelta;

		// Rubber-band if dragging past the most-open snap point
		const maxOpenOffset =
			ctx.resolvedSnapPoints()[ctx.resolvedSnapPoints().length - 1]?.offset ??
			0;
		if (newTranslate < maxOpenOffset) {
			const overflow = maxOpenOffset - newTranslate;
			newTranslate = maxOpenOffset - ctx.dampFunction(overflow);
		}

		// Throttle velocity cache (used in onUp for snap-point selection)
		const now = new Date();
		if (
			now.getTime() - cachedMoveTimestamp.getTime() >
			ctx.velocityCacheReset()
		) {
			cachedMoveTimestamp = now;
			cachedTranslate = ctx.translate();
		}

		ctx.setTranslateDrag(newTranslate);
	};

	const onPointerUp = (event: PointerEvent) => {
		if (event.pointerType !== "touch") onUp();
	};

	const onTouchEnd = (event: TouchEvent) => {
		if (event.touches.length === 0) onUp();
	};

	const onUp = () => {
		pointerDown = false;
		if (!ctx.isDragging()) return;

		const now = new Date();
		const velocity = ctx.velocityFunction(
			-(cachedTranslate - ctx.translate()),
			now.getTime() - cachedMoveTimestamp.getTime() || 1,
		);

		const translateWithVelocity = ctx.translate() * velocity;

		const closest = findClosestSnapPoint(
			snapPoints(),
			ctx.translate(),
			translateWithVelocity,
			ctx.allowSkippingSnapPoints(),
		);

		ctx.setTransitionState("snapping");
		ctx.setIsDragging(false);
		ctx.setTranslateDrag(null);

		const isClosingSnap = closest.offset >= ctx.drawerSize();

		if (isClosingSnap) {
			// Already off-screen — skip the CSS transition and unmount directly.
			ctx.setActiveSnapPoint(closest.value);
			ctx.closeDrawer();
			dialogCtx.close();
		} else {
			ctx.setActiveSnapPoint(closest.value);
			// CSS transition will play; onTransitionEnd clears "snapping" state.
			const dur = parseFloat(
				getComputedStyle(dialogCtx.contentRef()!).transitionDuration,
			);
			if (dur === 0) ctx.setTransitionState(null);
		}
	};

	const onTransitionEnd = (event: TransitionEvent) => {
		callHandler(event as any, p.onTransitionEnd as any);
		if (event.target !== dialogCtx.contentRef()) return;

		if (ctx.transitionState() === "closing") {
			ctx.closeDrawer();
		} else if (ctx.transitionState() !== null) {
			ctx.setTransitionState(null);
		}
	};

	// Safety net: if onTransitionEnd never fires (no CSS transition,
	// prefers-reduced-motion, browser quirk) the drawer would get stuck
	// mounted with pointer-events:none on the body. After two rAFs we check
	// the computed transition duration; if it's 0 we close immediately,
	// otherwise we set a timeout slightly longer than the animation.
	createEffect(
		() => ctx.transitionState() === "closing",
		(isClosing) => {
			if (!isClosing) return;
			let timeoutId: ReturnType<typeof setTimeout> | undefined;
			const raf1 = requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					if (ctx.transitionState() !== "closing") return;
					const el = dialogCtx.contentRef();
					if (!el) {
						ctx.closeDrawer();
						return;
					}
					const dur = parseFloat(getComputedStyle(el).transitionDuration);
					if (!dur || dur === 0) {
						ctx.closeDrawer();
						return;
					}
					timeoutId = setTimeout(
						() => {
							if (ctx.transitionState() === "closing") ctx.closeDrawer();
						},
						dur * 1000 + 100,
					);
				}),
			);
			return () => {
				cancelAnimationFrame(raf1);
				clearTimeout(timeoutId);
			};
		},
	);

	return (
		<DialogContent<
			Component<
				Omit<
					DrawerContentRenderProps,
					Exclude<
						keyof DialogContentRenderProps,
						| "data-side"
						| "data-opening"
						| "data-closing"
						| "data-snapping"
						| "data-transitioning"
					>
				>
			>
		>
			ref={mergeRefs(p.ref as any)}
			style={combineStyle(
				{
					transform: transformValue(),
					// Disable CSS transition during drag for instant 1:1 finger tracking.
					"transition-duration": ctx.isDragging() ? "0ms" : undefined,
				},
				p.style,
			)}
			onPointerDown={onPointerDown}
			onTouchStart={onTouchStart}
			onTransitionEnd={onTransitionEnd}
			data-side={ctx.side()}
			data-opening={ctx.transitionState() === "opening" ? "" : undefined}
			data-closing={ctx.transitionState() === "closing" ? "" : undefined}
			data-snapping={ctx.transitionState() === "snapping" ? "" : undefined}
			data-transitioning={ctx.isTransitioning() ? "" : undefined}
			{...others}
		/>
	);
}
