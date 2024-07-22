import {
	OverrideComponentProps,
	focusWithoutScrolling,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Component,
	type JSX,
	Show,
	type ValidComponent,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import createPreventScroll from "solid-prevent-scroll";
import {
	DismissableLayer,
	type DismissableLayerCommonProps,
	type DismissableLayerRenderProps,
} from "../dismissable-layer";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { Popper } from "../popper";
import {
	type FocusOutsideEvent,
	type InteractOutsideEvent,
	type PointerDownOutsideEvent,
	createFocusScope,
	createHideOutside,
} from "../primitives";
import { type SelectDataSet, useSelectContext } from "./select-context";

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

	const [local, others] = splitProps(props as SelectContentProps, [
		"ref",
		"style",
		"onCloseAutoFocus",
		"onFocusOutside",
	]);

	const onEscapeKeyDown = (e: KeyboardEvent) => {
		// `createSelectableList` prevent escape key down,
		// which prevent our `onDismiss` in `DismissableLayer` to run,
		// so we force "close on escape" here.
		context.close();
	};

	const onFocusOutside = (e: FocusOutsideEvent) => {
		local.onFocusOutside?.(e);

		// When focus is trapped (in modal mode), a `focusout` event may still happen.
		// We make sure we don't trigger our `onDismiss` in such case.
		if (context.isOpen() && context.isModal()) {
			e.preventDefault();
		}
	};

	// aria-hide everything except the content (better supported equivalent to setting aria-modal)
	createHideOutside({
		isDisabled: () => !(context.isOpen() && context.isModal()),
		targets: () => (ref ? [ref] : []),
	});

	createPreventScroll({
		element: () => ref ?? null,
		enabled: () => context.contentPresent() && context.preventScroll(),
	});

	createFocusScope(
		{
			trapFocus: () => context.isOpen() && context.isModal(),
			onMountAutoFocus: (e) => {
				// We prevent open autofocus because it's handled by the `Listbox`.
				e.preventDefault();
			},
			onUnmountAutoFocus: (e) => {
				local.onCloseAutoFocus?.(e);

				if (!e.defaultPrevented) {
					focusWithoutScrolling(context.triggerRef());
					e.preventDefault();
				}
			},
		},
		() => ref,
	);

	return (
		<Show when={context.contentPresent()}>
			<Popper.Positioner>
				<DismissableLayer<
					Component<
						Omit<SelectContentRenderProps, keyof DismissableLayerRenderProps>
					>
				>
					ref={mergeRefs((el) => {
						context.setContentRef(el);
						ref = el;
					}, local.ref)}
					disableOutsidePointerEvents={context.isModal() && context.isOpen()}
					excludedElements={[context.triggerRef]}
					style={combineStyle(
						{
							"--kb-select-content-transform-origin":
								"var(--kb-popper-content-transform-origin)",
							position: "relative",
						},
						local.style,
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
