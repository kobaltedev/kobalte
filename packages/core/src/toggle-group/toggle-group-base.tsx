import {
	type Orientation,
	composeEventHandlers,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createSignal,
	createUniqueId,
	splitProps,
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
	tabIndex: number | undefined;
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

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"value",
		"defaultValue",
		"disabled",
		"orientation",
		"selectionMode",
		"onChange",
		"onKeyDown",
		"onMouseDown",
		"onFocusIn",
		"onFocusOut",
	]);

	const [items, setItems] = createSignal<CollectionItemWithRef[]>([]);

	const { DomCollectionProvider } = createDomCollection({
		items,
		onItemsChange: setItems,
	});

	const listState = createListState({
		selectedKeys: () => local.value,
		defaultSelectedKeys: () => local.defaultValue,
		onSelectionChange: (key) => local.onChange?.(Array.from(key)),
		disallowEmptySelection: false,
		selectionMode: () => local.selectionMode,
		dataSource: items,
	});

	const { direction } = useLocale();

	const delegate = new TabsKeyboardDelegate(
		() => context.listState().collection(),
		direction,
		() => local.orientation!,
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
		isDisabled: () => local.disabled ?? false,
		isMultiple: () => local.selectionMode === "multiple",
		generateId: createGenerateId(() => others.id!),
		orientation: () => local.orientation!,
	};

	return (
		<DomCollectionProvider>
			<ToggleGroupContext.Provider value={context}>
				<Polymorphic<ToggleGroupBaseRenderProps>
					as="div"
					role="group"
					ref={mergeRefs((el) => (ref = el), local.ref)}
					tabIndex={!local.disabled ? selectableList.tabIndex() : undefined}
					data-orientation={local.orientation}
					onKeyDown={composeEventHandlers([
						local.onKeyDown,
						selectableList.onKeyDown,
					])}
					onMouseDown={composeEventHandlers([
						local.onMouseDown,
						selectableList.onMouseDown,
					])}
					onFocusIn={composeEventHandlers([
						local.onFocusIn,
						selectableList.onFocusIn,
					])}
					onFocusOut={composeEventHandlers([
						local.onFocusOut,
						selectableList.onFocusOut,
					])}
					{...(others as { id: string })}
				/>
			</ToggleGroupContext.Provider>
		</DomCollectionProvider>
	);
}
