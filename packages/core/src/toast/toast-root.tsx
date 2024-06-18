/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 *
 * Portions of this file are based on code from sonner.
 * MIT Licensed, Copyright (c) 2023 Emil Kowalski.
 *
 * Credits to the sonner team:
 * https://github.com/emilkowalski/sonner/blob/0d027fd3a41013fada9d8a3ef807bcc87053bde8/src/index.tsx
 */

import {
	callHandler,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type JSX,
	Show,
	type ValidComponent,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	on,
	onMount,
	splitProps,
} from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { combineStyle } from "@solid-primitives/props";
import createPresence from "solid-presence";
import { createRegisterId } from "../primitives";
import { ToastContext, type ToastContextValue } from "./toast-context";
import { useToastRegionContext } from "./toast-region-context";
import { toastStore } from "./toast-store";
import {
	TOAST_INTL_TRANSLATIONS,
	type ToastIntlTranslations,
} from "./toast.intl";
import type { ToastSwipeDirection } from "./types";

const TOAST_SWIPE_START_EVENT = "toast.swipeStart";
const TOAST_SWIPE_MOVE_EVENT = "toast.swipeMove";
const TOAST_SWIPE_CANCEL_EVENT = "toast.swipeCancel";
const TOAST_SWIPE_END_EVENT = "toast.swipeEnd";

export type SwipeEvent = { currentTarget: EventTarget & HTMLLIElement } & Omit<
	CustomEvent<{ originalEvent: PointerEvent; delta: { x: number; y: number } }>,
	"currentTarget"
>;

export interface ToastRootOptions {
	/** The localized strings of the component. */
	translations?: ToastIntlTranslations;

	/** The id of the toast provided by the `toaster`. */
	toastId: number;

	/**
	 * Control the sensitivity of the toast for accessibility purposes.
	 * For toasts that are the result of a user action, choose `high`.
	 * Toasts generated from background tasks should use `low`.
	 */
	priority?: "high" | "low";

	/**
	 * The time in milliseconds that should elapse before automatically closing the toast.
	 * This will override the value supplied to `Toast.Region`.
	 */
	duration?: number;

	/** Whether the toast should ignore duration and disappear only by a user action. */
	persistent?: boolean;

	/**
	 * Event handler called when the dismiss timer is paused.
	 * This occurs when the pointer is moved over the region or the region is focused.
	 */
	onPause?: () => void;

	/**
	 * Event handler called when the dismiss timer is resumed.
	 * This occurs when the pointer is moved away from the region or the region is blurred.
	 */
	onResume?: () => void;

	/** Event handler called when starting a swipe interaction. */
	onSwipeStart?: (event: SwipeEvent) => void;

	/** Event handler called during a swipe interaction. */
	onSwipeMove?: (event: SwipeEvent) => void;

	/** Event handler called when a swipe interaction is cancelled. */
	onSwipeCancel?: (event: SwipeEvent) => void;

	/** Event handler called at the end of a swipe interaction. */
	onSwipeEnd?: (event: SwipeEvent) => void;

	/**
	 * Event handler called when the escape key is down.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
}

export interface ToastRootCommonProps<T extends HTMLElement = HTMLElement> {
	style?: JSX.CSSProperties | string;
	id: string;
	ref: T | ((el: T) => void);
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface ToastRootRenderProps extends ToastRootCommonProps {
	role: "status";
	tabIndex: 0;
}

export type ToastRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToastRootOptions & Partial<ToastRootCommonProps<ElementOf<T>>>;

export function ToastRoot<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ToastRootProps<T>>,
) {
	const rootContext = useToastRegionContext();

	const mergedProps = mergeDefaultProps(
		{
			id: `toast-${createUniqueId()}`,
			priority: "high",
			translations: TOAST_INTL_TRANSLATIONS,
		},
		props as ToastRootProps,
	);

	const [local, others] = splitProps(
		mergedProps as typeof mergedProps & { toastId: string; id: string },
		[
			"ref",
			"translations",
			"toastId",
			"style",
			"priority",
			"duration",
			"persistent",
			"onPause",
			"onResume",
			"onSwipeStart",
			"onSwipeMove",
			"onSwipeCancel",
			"onSwipeEnd",
			"onEscapeKeyDown",
			"onKeyDown",
			"onPointerDown",
			"onPointerMove",
			"onPointerUp",
		],
	);

	const [isOpen, setIsOpen] = createSignal(true);
	const [titleId, setTitleId] = createSignal<string>();
	const [descriptionId, setDescriptionId] = createSignal<string>();
	const [isAnimationEnabled, setIsAnimationEnabled] = createSignal(true);
	const [ref, setRef] = createSignal<HTMLElement>();

	const { present } = createPresence({
		show: isOpen,
		element: () => ref() ?? null,
	});

	const duration = createMemo(() => local.duration || rootContext.duration());

	let closeTimerId: number;
	let closeTimerStartTime = 0;
	let closeTimerRemainingTime = duration();

	let pointerStart: { x: number; y: number } | null = null;
	let swipeDelta: { x: number; y: number } | null = null;

	const close = () => {
		setIsOpen(false);

		// Restore animation for the exit phase, which have been disabled if it's a toast update.
		setIsAnimationEnabled(true);
	};

	const deleteToast = () => {
		toastStore.remove(local.toastId);
	};

	const startTimer = (duration: number) => {
		if (!duration || local.persistent) {
			return;
		}

		window.clearTimeout(closeTimerId);

		closeTimerStartTime = new Date().getTime();
		closeTimerId = window.setTimeout(close, duration);
	};

	const resumeTimer = () => {
		startTimer(closeTimerRemainingTime);

		local.onResume?.();
	};

	const pauseTimer = () => {
		const elapsedTime = new Date().getTime() - closeTimerStartTime;
		closeTimerRemainingTime = closeTimerRemainingTime - elapsedTime;

		window.clearTimeout(closeTimerId);

		local.onPause?.();
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		if (e.key !== "Escape") {
			return;
		}

		local.onEscapeKeyDown?.(e);

		if (!e.defaultPrevented) {
			close();
		}
	};

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerDown);

		if (e.button !== 0) {
			return;
		}

		pointerStart = { x: e.clientX, y: e.clientY };
	};

	const onPointerMove: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerMove);

		if (!pointerStart) {
			return;
		}

		const x = e.clientX - pointerStart.x;
		const y = e.clientY - pointerStart.y;

		const hasSwipeMoveStarted = Boolean(swipeDelta);

		const isHorizontalSwipe = ["left", "right"].includes(
			rootContext.swipeDirection(),
		);

		const clamp = ["left", "up"].includes(rootContext.swipeDirection())
			? Math.min
			: Math.max;

		const clampedX = isHorizontalSwipe ? clamp(0, x) : 0;
		const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0;

		const moveStartBuffer = e.pointerType === "touch" ? 10 : 2;
		const delta = { x: clampedX, y: clampedY };

		const eventDetail = { originalEvent: e, delta };

		if (hasSwipeMoveStarted) {
			swipeDelta = delta;

			handleAndDispatchCustomEvent(
				TOAST_SWIPE_MOVE_EVENT,
				local.onSwipeMove,
				eventDetail,
			);

			const { x, y } = delta;
			e.currentTarget.setAttribute("data-swipe", "move");
			e.currentTarget.style.setProperty("--kb-toast-swipe-move-x", `${x}px`);
			e.currentTarget.style.setProperty("--kb-toast-swipe-move-y", `${y}px`);
		} else if (
			isDeltaInDirection(delta, rootContext.swipeDirection(), moveStartBuffer)
		) {
			swipeDelta = delta;

			handleAndDispatchCustomEvent(
				TOAST_SWIPE_START_EVENT,
				local.onSwipeStart,
				eventDetail,
			);
			e.currentTarget.setAttribute("data-swipe", "start");

			(e.target as HTMLElement).setPointerCapture(e.pointerId);
		} else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) {
			// User is swiping in wrong direction, so we disable swipe gesture
			// for the current pointer down interaction
			pointerStart = null;
		}
	};

	const onPointerUp: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (e) => {
		callHandler(e, local.onPointerUp);

		const delta = swipeDelta;
		const target = e.target as HTMLElement;

		if (target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);
		}

		swipeDelta = null;
		pointerStart = null;

		if (delta) {
			const toast = e.currentTarget;

			const eventDetail = { originalEvent: e, delta };
			if (
				isDeltaInDirection(
					delta,
					rootContext.swipeDirection(),
					rootContext.swipeThreshold(),
				)
			) {
				handleAndDispatchCustomEvent(
					TOAST_SWIPE_END_EVENT,
					local.onSwipeEnd,
					eventDetail,
				);

				const { x, y } = delta;
				e.currentTarget.setAttribute("data-swipe", "end");
				e.currentTarget.style.removeProperty("--kb-toast-swipe-move-x");
				e.currentTarget.style.removeProperty("--kb-toast-swipe-move-y");
				e.currentTarget.style.setProperty("--kb-toast-swipe-end-x", `${x}px`);
				e.currentTarget.style.setProperty("--kb-toast-swipe-end-y", `${y}px`);

				close();
			} else {
				handleAndDispatchCustomEvent(
					TOAST_SWIPE_CANCEL_EVENT,
					local.onSwipeCancel,
					eventDetail,
				);

				e.currentTarget.setAttribute("data-swipe", "cancel");
				e.currentTarget.style.removeProperty("--kb-toast-swipe-move-x");
				e.currentTarget.style.removeProperty("--kb-toast-swipe-move-y");
				e.currentTarget.style.removeProperty("--kb-toast-swipe-end-x");
				e.currentTarget.style.removeProperty("--kb-toast-swipe-end-y");
			}

			// Prevent click event from triggering on items within the toast when
			// pointer up is part of a swipe gesture
			toast.addEventListener("click", (event) => event.preventDefault(), {
				once: true,
			});
		}
	};

	onMount(() => {
		// Disable animation for updated toast.
		if (
			rootContext
				.toasts()
				.find((toast) => toast.id === local.toastId && toast.update)
		) {
			setIsAnimationEnabled(false);
		}
	});

	createEffect(
		on(
			() => rootContext.isPaused(),
			(isPaused) => {
				if (isPaused) {
					pauseTimer();
				} else {
					resumeTimer();
				}
			},
			{
				defer: true,
			},
		),
	);

	// start timer when toast opens or duration changes.
	// we include `open` in deps because closed !== unmounted when animating,
	// so it could reopen before being completely unmounted
	createEffect(
		on([isOpen, duration], ([isOpen, duration]) => {
			if (isOpen && !rootContext.isPaused()) {
				startTimer(duration);
			}
		}),
	);

	createEffect(
		on(
			() => toastStore.get(local.toastId)?.dismiss,
			(dismiss) => dismiss && close(),
		),
	);

	createEffect(
		on(
			() => present(),
			(isPresent) => !isPresent && deleteToast(),
		),
	);

	const context: ToastContextValue = {
		translations: () => local.translations!,
		close,
		duration,
		isPersistent: () => local.persistent ?? false,
		closeTimerStartTime: () => closeTimerStartTime,
		generateId: createGenerateId(() => others.id!),
		registerTitleId: createRegisterId(setTitleId),
		registerDescriptionId: createRegisterId(setDescriptionId),
	};

	return (
		<Show when={present()}>
			<ToastContext.Provider value={context}>
				<Polymorphic<ToastRootRenderProps>
					as="li"
					ref={mergeRefs(setRef, local.ref)}
					role="status"
					tabIndex={0}
					style={combineStyle(
						{
							animation: isAnimationEnabled() ? undefined : "none",
							"user-select": "none",
							"touch-action": "none",
						},
						local.style,
					)}
					aria-live={local.priority === "high" ? "assertive" : "polite"}
					aria-atomic="true"
					aria-labelledby={titleId()}
					aria-describedby={descriptionId()}
					data-opened={isOpen() ? "" : undefined}
					data-closed={!isOpen() ? "" : undefined}
					data-swipe-direction={rootContext.swipeDirection()}
					onKeyDown={onKeyDown}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					{...others}
				/>
			</ToastContext.Provider>
		</Show>
	);
}

function isDeltaInDirection(
	delta: { x: number; y: number },
	direction: ToastSwipeDirection,
	threshold = 0,
) {
	const deltaX = Math.abs(delta.x);
	const deltaY = Math.abs(delta.y);
	const isDeltaX = deltaX > deltaY;

	if (direction === "left" || direction === "right") {
		return isDeltaX && deltaX > threshold;
	}
	return !isDeltaX && deltaY > threshold;
}

function handleAndDispatchCustomEvent<C extends CustomEvent, E extends Event>(
	name: string,
	handler: ((event: C) => void) | undefined,
	detail: { originalEvent: E } & (C extends CustomEvent<infer D> ? D : never),
) {
	const currentTarget = detail.originalEvent.currentTarget as HTMLElement;
	const event = new CustomEvent(name, {
		bubbles: true,
		cancelable: true,
		detail,
	});

	if (handler) {
		currentTarget.addEventListener(name, handler as EventListener, {
			once: true,
		});
	}

	currentTarget.dispatchEvent(event);
}
