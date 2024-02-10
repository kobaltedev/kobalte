/**!
 * Portions of this file are based on code from Corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the Corvu team:
 * https://github.com/corvudev/corvu
 *
 * Part of this code is inspired by react-remove-scroll.
 * MIT License, Copyright (c) Anton Korzunov
 *
 * https://github.com/theKashey/react-remove-scroll
 */

import { MaybeAccessor, access } from "@kobalte/utils";
import {
	createEffect,
	createSignal,
	createUniqueId,
	mergeProps,
	on,
	onCleanup,
	onMount,
	untrack,
} from "solid-js";
import { isServer } from "solid-js/web";
import { createStyle } from "./create-style";
import { Axis, getScrollAtLocation } from "./scroll";

const [preventScrollStack, setPreventScrollStack] = createSignal<string[]>([]);
const [resetCallback, setResetCallback] = createSignal(() => {});

// Call once all prevent prevent scroll finished
createEffect(
	on(
		() => preventScrollStack(),
		(preventScrollStack) => {
			if (preventScrollStack.length === 0) {
				resetCallback()();
				setResetCallback(() => () => {});
			}
		},
	),
);

function isActive(id: string) {
	return preventScrollStack().indexOf(id) === preventScrollStack().length - 1;
}

/**
 * Prevents scroll outside of the given element.
 *
 * @param props.element - Prevent scroll outside of this element. If the element is `null`, scroll will be prevented on the whole page. *Default = `null`*
 * @param props.enabled - Whether scroll should be prevented. *Default = `true`*
 * @param props.allowPinchZoom - Whether pinch zoom should be allowed. *Default = `true`*
 * @param props.scrollBack - Whether to scroll back to initial position on cleanup. *Default = `true`*
 */
export function createPreventScroll(props: {
	element?: MaybeAccessor<HTMLElement | null>;
	enabled?: MaybeAccessor<boolean>;
	allowPinchZoom?: MaybeAccessor<boolean>;
	scrollBack?: boolean;
}) {
	const defaultedProps = mergeProps(
		{
			element: null,
			enabled: true,
			allowPinchZoom: true,
			scrollBack: true,
		},
		props,
	);

	const preventScrollId = createUniqueId();

	let currentTouchStart: [number, number] = [0, 0];
	let currentTouchStartAxis: Axis | null = null;
	let currentTouchStartDelta: number | null = null;

	onMount(() => {
		if (isServer) return;

		if (!access(defaultedProps.enabled)) return;

		setPreventScrollStack((stack) => [...stack, preventScrollId]);

		onCleanup(() => {
			setPreventScrollStack((stack) =>
				stack.filter((id) => id !== preventScrollId),
			);
		});
	});

	createEffect(() => {
		if (isServer) return;

		if (
			!access(defaultedProps.enabled) ||
			!preventScrollStack().includes(preventScrollId)
		)
			return;

		if (!preventScrollStack().includes(preventScrollId)) {
			untrack(() => {
				setPreventScrollStack((stack) => [...stack, preventScrollId]);
			});
		}

		onCleanup(() => {
			setPreventScrollStack((stack) =>
				stack.filter((id) => id !== preventScrollId),
			);
		});

		const { body } = document;

		const scrollbarWidth = window.innerWidth - body.offsetWidth;

		const style: Partial<CSSStyleDeclaration> = {
			overflow: "hidden",
		};
		const properties: {
			key: string;
			value: string;
		}[] = [];

		if (scrollbarWidth > 0) {
			style.paddingRight = `calc(${
				window.getComputedStyle(body).paddingRight
			} + ${scrollbarWidth}px)`;

			properties.push({
				key: "--scrollbar-width",
				value: `${scrollbarWidth}px`,
			});
		}

		const offsetTop = window.scrollY;
		const offsetLeft = window.scrollX;

		if (preventScrollStack().length === 1) {
			const createStyleCleanup = createStyle({
				element: body,
				style,
				properties,
			});

			setResetCallback(() => () => {
				createStyleCleanup();
				if (props.scrollBack && scrollbarWidth > 0) {
					window.scrollTo(offsetLeft, offsetTop);
				}
			});
		}
	});

	createEffect(() => {
		if (isServer) return;

		if (!isActive(preventScrollId) || !access(defaultedProps.enabled)) return;

		document.addEventListener("wheel", maybePreventWheel, {
			passive: false,
		});
		document.addEventListener("touchstart", logTouchStart, {
			passive: false,
		});
		document.addEventListener("touchmove", maybePreventTouch, {
			passive: false,
		});

		onCleanup(() => {
			document.removeEventListener("wheel", maybePreventWheel);
			document.removeEventListener("touchstart", logTouchStart);
			document.removeEventListener("touchmove", maybePreventTouch);
		});
	});

	const logTouchStart = (event: TouchEvent) => {
		currentTouchStart = getTouchXY(event);
		currentTouchStartAxis = null;
		currentTouchStartDelta = null;
	};

	const maybePreventWheel = (event: WheelEvent) => {
		const target = event.target as HTMLElement;
		const wrapper = access(defaultedProps.element);

		const delta = getDeltaXY(event as WheelEvent);
		const axis = Math.abs(delta[0]) > Math.abs(delta[1]) ? "x" : "y";
		const axisDelta = axis === "x" ? delta[0] : delta[1];

		const resultsInScroll = wouldScroll(target, axis, axisDelta, wrapper);
		let shouldCancel: boolean;
		if (wrapper?.contains(target)) {
			shouldCancel = !resultsInScroll;
		} else {
			shouldCancel = resultsInScroll;
		}
		if (shouldCancel && event.cancelable) {
			event.preventDefault();
		}
	};

	const maybePreventTouch = (event: TouchEvent) => {
		const wrapper = access(defaultedProps.element);
		const target = event.target as HTMLElement;

		let shouldCancel: boolean;

		// Two touch points = pinch zoom
		if (event.touches.length === 2) {
			shouldCancel = !access(defaultedProps.allowPinchZoom);
		} else {
			if (currentTouchStartAxis === null || currentTouchStartDelta === null) {
				const delta = getTouchXY(event).map(
					(touch, i) => currentTouchStart[i]! - touch,
				) as [number, number];
				const axis = Math.abs(delta[0]) > Math.abs(delta[1]) ? "x" : "y";

				currentTouchStartAxis = axis;
				currentTouchStartDelta = axis === "x" ? delta[0] : delta[1];
			}

			// Allow touch on range inputs
			if ((target as HTMLInputElement).type === "range") {
				shouldCancel = false;
			} else {
				const wouldResultInScroll = wouldScroll(
					target,
					currentTouchStartAxis,
					currentTouchStartDelta,
					wrapper,
				);
				if (wrapper?.contains(target)) {
					shouldCancel = !wouldResultInScroll;
				} else {
					shouldCancel = wouldResultInScroll;
				}
			}
		}

		if (shouldCancel && event.cancelable) {
			event.preventDefault();
		}
	};
}

function getDeltaXY(event: WheelEvent): [number, number] {
	return [event.deltaX, event.deltaY];
}

function getTouchXY(event: TouchEvent): [number, number] {
	return event.changedTouches[0]
		? [event.changedTouches[0].clientX, event.changedTouches[0].clientY]
		: [0, 0];
}

/**
 * Checks whether a certain delta on a target would result in scrolling on the given axis.
 *
 * @param target - The target element.
 * @param delta - The delta to check.
 * @param axis - The axis to check.
 * @param wrapper - The wrapper element. If the target is contained in the wrapper, the function will check if it would scroll inside the wrapper
 * @returns Whether the delta would result in scrolling on the given axis.
 */
function wouldScroll(
	target: HTMLElement,
	axis: Axis,
	delta: number,
	wrapper: HTMLElement | null,
) {
	const targetInWrapper = wrapper?.contains(target);

	const [availableScroll, availableScrollTop] = getScrollAtLocation(
		target,
		axis,
		targetInWrapper ? wrapper : undefined,
	);

	// On firefox, availableScroll can be 1 even if there is no scroll available.
	if (delta > 0 && Math.abs(availableScroll) <= 1) {
		return false;
	}
	return !(delta < 0 && Math.abs(availableScrollTop) < 1);
}
