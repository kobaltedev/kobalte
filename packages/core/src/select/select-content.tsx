import { focusWithoutScrolling } from "@kobalte/utils";
import { createFocusTrap } from "@solid-primitives/focus";
import {
	createHideOutside,
	type FocusOutsideEvent,
	type InteractOutsideEvent,
	type PointerDownOutsideEvent,
} from "@solid-primitives/interaction";

import { combineStyle } from "@solid-primitives/props";
import { createPreventScroll } from "@solid-primitives/scroll";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, createEffect, omit, Show } from "solid-js";
import {
	DismissableLayer,
	type DismissableLayerCommonProps,
	type DismissableLayerRenderProps,
} from "../dismissable-layer/index.ts";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";
import { Popper } from "../popper/index.tsx";
import { type SelectDataSet, useSelectContext } from "./select-context.tsx";

export interface SelectContentOptions {
	/**
	 * Event handler called when focus moves to the trigger after closing.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onCloseAutoFocus?: (event: Event) => void;

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

export interface SelectContentCommonProps<T extends HTMLElement = HTMLElement>
	extends DismissableLayerCommonProps<T> {
	style?: JSX.CSSProperties | string;
}

export interface SelectContentRenderProps
	extends SelectContentCommonProps,
		SelectDataSet,
		DismissableLayerRenderProps {}

export type SelectContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SelectContentOptions & Partial<SelectContentCommonProps<ElementOf<T>>>;

/**
 * The component that pops out when the select is open.
 */
export function SelectContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SelectContentProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const context = useSelectContext();

	const others = omit(
		props as SelectContentProps,
		"ref",
		"style",
		"onCloseAutoFocus",
		"onFocusOutside",
	);

	const onEscapeKeyDown = (_e: KeyboardEvent) => {
		// `createSelectableList` prevent escape key down,
		// which prevent our `onDismiss` in `DismissableLayer` to run,
		// so we force "close on escape" here.
		context.close();
	};

	const onFocusOutside = (e: FocusOutsideEvent) => {
		props.onFocusOutside?.(e);

		// When focus is trapped (in modal mode), a `focusout` event may still happen.
		// We make sure we don't trigger our `onDismiss` in such case.
		if (context.isOpen() && context.isModal()) {
			e.preventDefault();
		}
	};

	// aria-hide everything except the content (better supported equivalent to setting aria-modal)
	createHideOutside({
		disabled: () => !(context.isOpen() && context.isModal()),
		targets: () => (ref ? [ref] : []),
		alwaysVisibleSelector: "[data-kb-top-layer], [data-live-announcer]",
	});

	createPreventScroll({
		element: () => ref ?? undefined,
		enabled: () => context.contentPresent() && context.preventScroll(),
	});

	const onFinalFocus = (e: Event) => {
		props.onCloseAutoFocus?.(e);

		if (!e.defaultPrevented) {
			focusWithoutScrolling(context.triggerRef());
			e.preventDefault();
		}
	};

	createFocusTrap({
		element: () => ref,
		enabled: () => context.isOpen() && context.isModal(),
		onInitialFocus: (e) => {
			// We prevent open autofocus because it's handled by the `Listbox`.
			e.preventDefault();
		},
		onFinalFocus,
	});

	// `createFocusTrap`'s `enabled` flag gates both Tab-trapping AND focus
	// restoration behind modal mode, so a non-modal select (Select's default)
	// never gets `onFinalFocus`. Restore focus to the trigger ourselves when
	// content closes while non-modal.
	createEffect(
		() => context.contentPresent() && !context.isModal(),
		(isNonModalAndPresent) => {
			if (!isNonModalAndPresent) {
				return;
			}

			return () => {
				onFinalFocus(
					new CustomEvent("selectCloseAutoFocus", {
						bubbles: false,
						cancelable: true,
					}),
				);
			};
		},
	);

	return (
		<Show when={context.contentPresent()}>
			<Popper.Positioner>
				<DismissableLayer<
					Component<
						Omit<SelectContentRenderProps, keyof DismissableLayerRenderProps>
					>
				>
					ref={[
						(el: HTMLElement) => {
							context.setContentRef(el);
							ref = el;
						},
						props.ref,
					]}
					disableOutsidePointerEvents={context.isModal() && context.isOpen()}
					excludedElements={[context.triggerRef]}
					style={combineStyle(
						{
							"--kb-select-content-transform-origin":
								"var(--kb-popper-content-transform-origin)",
							position: "relative",
						},
						props.style,
					)}
					onEscapeKeyDown={onEscapeKeyDown}
					onFocusOutside={onFocusOutside}
					onDismiss={context.close}
					{...context.dataset()}
					{...others}
				/>
			</Popper.Positioner>
		</Show>
	);
}
