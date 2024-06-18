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
	contains,
	focusWithoutScrolling,
	getDocument,
	getWindow,
	mergeRefs,
} from "@kobalte/utils";
import {
	For,
	type JSX,
	type ValidComponent,
	createEffect,
	on,
	onCleanup,
	splitProps,
} from "solid-js";
import { isServer } from "solid-js/web";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { useToastRegionContext } from "./toast-region-context";

export interface ToastListOptions {}

export interface ToastListCommonProps<T extends HTMLElement = HTMLElement> {
	ref: T | ((el: T) => void);
	onFocusIn: JSX.EventHandlerUnion<T, FocusEvent>;
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface ToastListRenderProps extends ToastListCommonProps {
	children: JSX.Element;
	tabIndex: -1;
}

export type ToastListProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToastListOptions & Partial<ToastListCommonProps<ElementOf<T>>>;

/**
 * The list containing all rendered toasts.
 * Must be inside a `Toast.Region`.
 */
export function ToastList<T extends ValidComponent = "ol">(
	props: PolymorphicProps<T, ToastListProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const context = useToastRegionContext();

	const [local, others] = splitProps(props as ToastListProps, [
		"ref",
		"onFocusIn",
		"onFocusOut",
		"onPointerMove",
		"onPointerLeave",
	]);

	const onFocusIn: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocusIn);

		if (context.pauseOnInteraction() && !context.isPaused()) {
			context.pauseAllTimer();
		}
	};

	const onFocusOut: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocusOut);

		// The newly focused element isn't inside the toast list.
		if (!contains(ref, e.relatedTarget as HTMLElement)) {
			context.resumeAllTimer();
		}
	};

	const onPointerMove: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerMove);

		if (context.pauseOnInteraction() && !context.isPaused()) {
			context.pauseAllTimer();
		}
	};

	const onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerLeave);

		// The current active element isn't inside the toast list.
		if (!contains(ref, getDocument(ref).activeElement)) {
			context.resumeAllTimer();
		}
	};

	createEffect(
		on([() => ref, () => context.hotkey()], ([ref, hotkey]) => {
			if (isServer) {
				return;
			}

			if (!ref) {
				return;
			}

			const doc = getDocument(ref);

			const onKeyDown = (event: KeyboardEvent) => {
				const isHotkeyPressed = hotkey.every(
					(key) => (event as any)[key] || event.code === key,
				);

				if (isHotkeyPressed) {
					focusWithoutScrolling(ref);
				}
			};

			doc.addEventListener("keydown", onKeyDown);

			onCleanup(() => doc.removeEventListener("keydown", onKeyDown));
		}),
	);

	createEffect(() => {
		if (!context.pauseOnPageIdle()) {
			return;
		}

		const win = getWindow(ref);

		win.addEventListener("blur", context.pauseAllTimer);
		win.addEventListener("focus", context.resumeAllTimer);

		onCleanup(() => {
			win.removeEventListener("blur", context.pauseAllTimer);
			win.removeEventListener("focus", context.resumeAllTimer);
		});
	});

	return (
		<Polymorphic<ToastListRenderProps>
			as="ol"
			ref={mergeRefs((el) => (ref = el), local.ref)}
			tabIndex={-1}
			onFocusIn={onFocusIn}
			onFocusOut={onFocusOut}
			onPointerMove={onPointerMove}
			onPointerLeave={onPointerLeave}
			{...others}
		>
			<For each={context.toasts()}>
				{(toast) =>
					toast.toastComponent({
						get toastId() {
							return toast.id;
						},
					})
				}
			</For>
		</Polymorphic>
	);
}
