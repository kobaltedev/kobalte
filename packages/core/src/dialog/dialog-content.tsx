/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dialog/src/Dialog.tsx
 */

import {
	contains,
	focusWithoutScrolling,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Component,
	Show,
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import createPreventScroll from "solid-prevent-scroll";
import {
	DismissableLayer,
	type DismissableLayerCommonProps,
	type DismissableLayerRenderProps,
} from "../dismissable-layer";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	type FocusOutsideEvent,
	type InteractOutsideEvent,
	type PointerDownOutsideEvent,
	createFocusScope,
	createHideOutside,
} from "../primitives";
import { useDialogContext } from "./dialog-context";

export interface DialogContentOptions {
	/**
	 * Event handler called when focus moves into the component after opening.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onOpenAutoFocus?: (event: Event) => void;

	/**
	 * Event handler called when focus moves to the trigger after closing.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onCloseAutoFocus?: (event: Event) => void;

	/**
	 * Event handler called when the escape key is down.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;

	/**
	 * Event handler called when a pointer event occurs outside the bounds of the component.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

	/**
	 * Event handler called when the focus moves outside the bounds of the component.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onFocusOutside?: (event: FocusOutsideEvent) => void;

	/**
	 * Event handler called when an interaction (pointer or focus event) happens outside the bounds of the component.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onInteractOutside?: (event: InteractOutsideEvent) => void;
}

export interface DialogContentCommonProps<T extends HTMLElement = HTMLElement>
	extends DismissableLayerCommonProps<T> {
	id: string;
}

export interface DialogContentRenderProps
	extends DialogContentCommonProps,
		DismissableLayerRenderProps {
	role: "dialog" | "alertdialog";
	tabIndex: -1;
}

export type DialogContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DialogContentOptions & Partial<DialogContentCommonProps<ElementOf<T>>>;

/**
 * Contains the content to be rendered when the dialog is open.
 */
export function DialogContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DialogContentProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const context = useDialogContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("content"),
		},
		props as DialogContentProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"onOpenAutoFocus",
		"onCloseAutoFocus",
		"onPointerDownOutside",
		"onFocusOutside",
		"onInteractOutside",
	]);

	let hasInteractedOutside = false;
	let hasPointerDownOutside = false;

	const onPointerDownOutside = (e: PointerDownOutsideEvent) => {
		local.onPointerDownOutside?.(e);

		// If the event is a right-click, we shouldn't close because
		// it is effectively as if we right-clicked the `Overlay`.
		if (context.modal() && e.detail.isContextMenu) {
			e.preventDefault();
		}
	};

	const onFocusOutside = (e: FocusOutsideEvent) => {
		local.onFocusOutside?.(e);

		// When focus is trapped, a `focusout` event may still happen.
		// We make sure we don't trigger our `onDismiss` in such case.
		if (context.modal()) {
			e.preventDefault();
		}
	};

	const onInteractOutside = (e: InteractOutsideEvent) => {
		local.onInteractOutside?.(e);

		if (context.modal()) {
			return;
		}

		// Non-modal behavior below

		if (!e.defaultPrevented) {
			hasInteractedOutside = true;

			if (e.detail.originalEvent.type === "pointerdown") {
				hasPointerDownOutside = true;
			}
		}

		// Prevent dismissing when clicking the trigger.
		// As the trigger is already setup to close, without doing so would
		// cause it to close and immediately open.
		if (contains(context.triggerRef(), e.target as HTMLElement)) {
			e.preventDefault();
		}

		// On Safari if the trigger is inside a container with tabIndex={0}, when clicked
		// we will get the pointer down outside event on the trigger, but then a subsequent
		// focus outside event on the container, we ignore any focus outside event when we've
		// already had a pointer down outside event.
		if (e.detail.originalEvent.type === "focusin" && hasPointerDownOutside) {
			e.preventDefault();
		}
	};

	const onCloseAutoFocus = (e: Event) => {
		local.onCloseAutoFocus?.(e);

		if (context.modal()) {
			e.preventDefault();
			focusWithoutScrolling(context.triggerRef());
		} else {
			if (!e.defaultPrevented) {
				if (!hasInteractedOutside) {
					focusWithoutScrolling(context.triggerRef());
				}

				// Always prevent autofocus because we either focus manually or want user agent focus
				e.preventDefault();
			}

			hasInteractedOutside = false;
			hasPointerDownOutside = false;
		}
	};

	// aria-hide everything except the content (better supported equivalent to setting aria-modal)
	createHideOutside({
		isDisabled: () => !(context.isOpen() && context.modal()),
		targets: () => (ref ? [ref] : []),
	});

	createPreventScroll({
		element: () => ref ?? null,
		enabled: () => context.contentPresent() && context.preventScroll(),
	});

	createFocusScope(
		{
			trapFocus: () => context.isOpen() && context.modal(),
			onMountAutoFocus: local.onOpenAutoFocus,
			onUnmountAutoFocus: onCloseAutoFocus,
		},
		() => ref,
	);

	createEffect(() => onCleanup(context.registerContentId(others.id!)));

	return (
		<Show when={context.contentPresent()}>
			<DismissableLayer<
				Component<
					Omit<DialogContentRenderProps, keyof DismissableLayerRenderProps>
				>
			>
				ref={mergeRefs((el) => {
					context.setContentRef(el);
					ref = el;
				}, local.ref)}
				role="dialog"
				tabIndex={-1}
				disableOutsidePointerEvents={context.modal() && context.isOpen()}
				excludedElements={[context.triggerRef]}
				aria-labelledby={context.titleId()}
				aria-describedby={context.descriptionId()}
				data-expanded={context.isOpen() ? "" : undefined}
				data-closed={!context.isOpen() ? "" : undefined}
				onPointerDownOutside={onPointerDownOutside}
				onFocusOutside={onFocusOutside}
				onInteractOutside={onInteractOutside}
				onDismiss={context.close}
				{...others}
			/>
		</Show>
	);
}
