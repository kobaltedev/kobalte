import {
	Orientation,
	callHandler,
	composeEventHandlers,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	Component,
	JSX,
	ValidComponent,
	createUniqueId,
	splitProps,
} from "solid-js";
import { PolymorphicProps } from "../polymorphic";
import { CollectionItemWithRef } from "../primitives";
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

	onChange?: JSX.ChangeEventHandlerUnion<HTMLButtonElement, Event>;
}

export interface ToggleGroupItemCommonProps {
	id: string;
	ref: HTMLElement | ((el: HTMLElement) => void);
	disabled: boolean | undefined;
	onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
	onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent>;
}

export interface ToggleGroupItemRenderProps
	extends ToggleGroupItemCommonProps,
		ToggleButton.ToggleButtonRootRenderProps {
	tabIndex: number | undefined;
	"data-orientation": Orientation;
}

export type ToggleGroupItemProps = ToggleGroupItemOptions &
	Partial<ToggleGroupItemCommonProps>;

export function ToggleGroupItem<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, ToggleGroupItemProps>,
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

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"value",
		"disabled",
		"onPointerDown",
		"onPointerUp",
		"onClick",
		"onKeyDown",
		"onMouseDown",
		"onFocus",
		"onChange",
	]);

	const selectionManager = () => rootContext.listState().selectionManager();

	const isDisabled = () => rootContext.isDisabled() || local.disabled;

	createDomCollectionItem<CollectionItemWithRef>({
		getItem: () => ({
			ref: () => ref,
			type: "item",
			key: local.value,
			textValue: "",
			disabled: local.disabled! || rootContext.isDisabled(),
		}),
	});

	const selectableItem = createSelectableItem(
		{
			key: () => local.value,
			selectionManager: selectionManager,
			disabled: local.disabled || rootContext.isDisabled(),
		},
		() => ref,
	);

	const onKeyDown: JSX.EventHandlerUnion<Element, KeyboardEvent> = (e) => {
		// Prevent `Enter` and `Space` default behavior which fires a click event when using a <button>.
		if (["Enter", " "].includes(e.key)) {
			e.preventDefault();
		}

		callHandler(e, local.onKeyDown as typeof onKeyDown);
		callHandler(e, selectableItem.onKeyDown);
	};

	return (
		<ToggleButton.Root<
			Component<
				Omit<
					ToggleGroupItemRenderProps,
					Exclude<keyof ToggleButton.ToggleButtonRootRenderProps, "tabIndex">
				>
			>
		>
			ref={mergeRefs((el) => (ref = el), local.ref)}
			pressed={selectionManager().isSelected(local.value)}
			tabIndex={selectableItem.tabIndex()}
			data-orientation={rootContext.orientation()}
			disabled={isDisabled()}
			onPointerDown={composeEventHandlers([
				local.onPointerDown,
				selectableItem.onPointerDown,
			])}
			onPointerUp={composeEventHandlers([
				local.onPointerUp,
				selectableItem.onPointerUp,
			])}
			onClick={composeEventHandlers([local.onClick, selectableItem.onClick])}
			onKeyDown={onKeyDown}
			onMouseDown={composeEventHandlers([
				local.onMouseDown,
				selectableItem.onMouseDown,
			])}
			onFocus={composeEventHandlers([local.onFocus, selectableItem.onFocus])}
			{...others}
		/>
	);
}
