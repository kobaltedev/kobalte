import {
	type Orientation,
	callHandler,
	composeEventHandlers,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	type Component,
	createUniqueId,
	omit,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import type { CollectionItemWithRef } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import * as ToggleButton from "../toggle-button";
import { useToggleGroupContext } from "./toggle-group-context";

export interface ToggleGroupItemOptions
	extends Omit<
		ToggleButton.ToggleButtonRootOptions,
		"pressed" | "defaultPressed" | "onChange"
	> {
	/** A string value for the toggle group item. All items within a toggle group should use a unique value. */
	value: string;
}

export interface ToggleGroupItemCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	disabled: boolean | undefined;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface ToggleGroupItemRenderProps
	extends ToggleGroupItemCommonProps,
		ToggleButton.ToggleButtonRootRenderProps {
	tabindex: number | undefined;
	"data-orientation": Orientation;
}

export type ToggleGroupItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToggleGroupItemOptions & Partial<ToggleGroupItemCommonProps<ElementOf<T>>>;

export function ToggleGroupItem<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, ToggleGroupItemProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const rootContext = useToggleGroupContext();

	const defaultID = rootContext.generateId(`item-${createUniqueId()}`);

	const mergedProps = mergeDefaultProps(
		{
			id: defaultID,
		},
		props as ToggleGroupItemProps,
	);

	const others = omit(mergedProps, "ref", "value", "disabled", "onPointerDown", "onPointerUp", "onClick", "onKeyDown", "onMouseDown", "onFocus");

	const selectionManager = () => rootContext.listState().selectionManager();

	const isDisabled = () => rootContext.isDisabled() || mergedProps.disabled;

	createDomCollectionItem<CollectionItemWithRef>({
		getItem: () => ({
			ref: () => ref,
			type: "item",
			key: mergedProps.value,
			textValue: "",
			disabled: mergedProps.disabled! || rootContext.isDisabled(),
		}),
	});

	const selectableItem = createSelectableItem(
		{
			key: () => mergedProps.value,
			selectionManager: selectionManager,
			disabled: isDisabled,
		},
		() => ref,
	);

	const onKeyDown: JSX.EventHandlerUnion<Element, KeyboardEvent> = (e) => {
		// Prevent `Enter` and `Space` default behavior which fires a click event when using a <button>.
		if (["Enter", " "].includes(e.key)) {
			e.preventDefault();
		}

		callHandler(e, mergedProps.onKeyDown as typeof onKeyDown);
		callHandler(e, selectableItem.onKeyDown);
	};

	return (
		<ToggleButton.Root<
			Component<
				Omit<
					ToggleGroupItemRenderProps,
					Exclude<keyof ToggleButton.ToggleButtonRootRenderProps, "tabindex">
				>
			>
		>
			ref={mergeRefs((el) => (ref = el), mergedProps.ref)}
			pressed={selectionManager().isSelected(mergedProps.value)}
			tabindex={selectableItem.tabIndex()}
			data-orientation={rootContext.orientation()}
			disabled={isDisabled()}
			onPointerDown={composeEventHandlers([
				mergedProps.onPointerDown,
				selectableItem.onPointerDown,
			])}
			onPointerUp={composeEventHandlers([
				mergedProps.onPointerUp,
				selectableItem.onPointerUp,
			])}
			onClick={composeEventHandlers([mergedProps.onClick, selectableItem.onClick])}
			onKeyDown={onKeyDown}
			onMouseDown={composeEventHandlers([
				mergedProps.onMouseDown,
				selectableItem.onMouseDown,
			])}
			onFocus={composeEventHandlers([mergedProps.onFocus, selectableItem.onFocus])}
			{...others}
		/>
	);
}
