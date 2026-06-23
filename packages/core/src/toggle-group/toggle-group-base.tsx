import {
	type Orientation,
	composeEventHandlers,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	createSignal,
	createUniqueId,
	omit,
} from "solid-js";
import { useLocale } from "../i18n";
import { createListState } from "../list";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import type { CollectionItemWithRef } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { type SelectionMode, createSelectableCollection } from "../selection";
import { TabsKeyboardDelegate } from "../tabs/tabs-keyboard-delegate";
import {
	ToggleGroupContext,
	type ToggleGroupContextValue,
} from "./toggle-group-context";

export interface ToggleGroupBaseOptions {
	/** The controlled value of the toggle group. */
	value?: string[];

	/**
	 * The value of the select when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: string[];

	/** Event handler called when the value changes. */
	onChange?: (value: string[]) => void;

	/** The type of selection that is allowed in the toggle group. */
	selectionMode?: Exclude<SelectionMode, "none">;

	/** Whether the toggle group is disabled. */
	disabled?: boolean;

	/** The axis the toggle group items should align with. */
	orientation?: Orientation;
}

export interface ToggleGroupBaseCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocusIn: JSX.EventHandlerUnion<T, FocusEvent>;
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface ToggleGroupBaseRenderProps extends ToggleGroupBaseCommonProps {
	role: "group";
	tabindex: number | undefined;
	"data-orientation": Orientation | undefined;
}

export type ToggleGroupBaseProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToggleGroupBaseOptions & Partial<ToggleGroupBaseCommonProps<ElementOf<T>>>;

export function ToggleGroupBase<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ToggleGroupBaseProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `group-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			selectionMode: "single",
			orientation: "horizontal",
		},
		props as ToggleGroupBaseProps,
	);

	const others = omit(mergedProps, "ref", "value", "defaultValue", "disabled", "orientation", "selectionMode", "onChange", "onKeyDown", "onMouseDown", "onFocusIn", "onFocusOut");

	const [items, setItems] = createSignal<CollectionItemWithRef[]>([]);

	const { DomCollectionProvider } = createDomCollection({
		items,
		onItemsChange: setItems,
	});

	const listState = createListState({
		selectedKeys: () => mergedProps.value,
		defaultSelectedKeys: () => mergedProps.defaultValue,
		onSelectionChange: (key) => mergedProps.onChange?.(Array.from(key)),
		disallowEmptySelection: false,
		selectionMode: () => mergedProps.selectionMode,
		dataSource: items,
	});

	const { direction } = useLocale();

	const delegate = new TabsKeyboardDelegate(
		() => context.listState().collection(),
		direction,
		() => mergedProps.orientation!,
	);

	const selectableList = createSelectableCollection(
		{
			selectionManager: () => listState.selectionManager(),
			keyboardDelegate: () => delegate,
			disallowEmptySelection: () =>
				listState.selectionManager().disallowEmptySelection(),
			disallowTypeAhead: true,
		},
		() => ref,
	);

	const context: ToggleGroupContextValue = {
		listState: () => listState,
		isDisabled: () => mergedProps.disabled ?? false,
		isMultiple: () => mergedProps.selectionMode === "multiple",
		generateId: createGenerateId(() => others.id!),
		orientation: () => mergedProps.orientation!,
	};

	return (
		<DomCollectionProvider>
			<ToggleGroupContext value={context}>
				<Polymorphic<ToggleGroupBaseRenderProps>
					as="div"
					role="group"
					ref={mergeRefs((el) => (ref = el), mergedProps.ref)}
					tabindex={!mergedProps.disabled ? selectableList.tabIndex() : undefined}
					data-orientation={mergedProps.orientation}
					onKeyDown={composeEventHandlers([
						mergedProps.onKeyDown,
						selectableList.onKeyDown,
					])}
					onMouseDown={composeEventHandlers([
						mergedProps.onMouseDown,
						selectableList.onMouseDown,
					])}
					onFocusIn={composeEventHandlers([
						mergedProps.onFocusIn,
						selectableList.onFocusIn,
					])}
					onFocusOut={composeEventHandlers([
						mergedProps.onFocusOut,
						selectableList.onFocusOut,
					])}
					{...(others as { id: string })}
				/>
			</ToggleGroupContext>
		</DomCollectionProvider>
	);
}
