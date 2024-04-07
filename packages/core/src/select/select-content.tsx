import {
	OverrideComponentProps,
	focusWithoutScrolling,
	mergeRefs,
} from "@kobalte/utils";
import { Component, JSX, Show, ValidComponent, splitProps } from "solid-js";

import createPreventScroll from "solid-prevent-scroll";
import {
	DismissableLayer,
	DismissableLayerCommonProps,
	DismissableLayerRenderProps,
} from "../dismissable-layer";
import { PolymorphicProps } from "../polymorphic";
import { PopperPositioner } from "../popper";
import {
	FocusOutsideEvent,
	InteractOutsideEvent,
	PointerDownOutsideEvent,
	createFocusScope,
	createHideOutside,
} from "../primitives";
import { SelectDataSet, useSelectContext } from "./select-context";

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

export interface SelectContentCommonProps extends DismissableLayerCommonProps {
	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
}

export interface SelectContentRenderProps
	extends SelectContentCommonProps,
		SelectDataSet,
		DismissableLayerRenderProps {}

export type SelectContentProps = SelectContentOptions &
	Partial<SelectContentCommonProps>;

/**
 * The component that pops out when the select is open.
 */
export function SelectContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SelectContentProps>,
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
		enabled: () => context.isOpen() && context.preventScroll(),
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
		<Show when={context.contentPresence.isPresent()}>
			<PopperPositioner>
				<DismissableLayer<
					Component<
						Omit<SelectContentRenderProps, keyof DismissableLayerRenderProps>
					>
				>
					ref={mergeRefs((el) => {
						context.setContentRef(el);
						context.contentPresence.setRef(el);
						ref = el;
					}, local.ref)}
					disableOutsidePointerEvents={context.isModal() && context.isOpen()}
					excludedElements={[context.triggerRef]}
					style={{
						"--kb-select-content-transform-origin":
							"var(--kb-popper-content-transform-origin)",
						position: "relative",
						...local.style,
					}}
					onEscapeKeyDown={onEscapeKeyDown}
					onFocusOutside={onFocusOutside}
					onDismiss={context.close}
					{...context.dataset()}
					{...others}
				/>
			</PopperPositioner>
		</Show>
	);
}
