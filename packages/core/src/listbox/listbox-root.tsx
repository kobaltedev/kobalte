/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useListBox.ts
 */

import {
	Key,
	OverrideComponentProps,
	access,
	composeEventHandlers,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	Match,
	Show,
	Switch,
	createMemo,
	createUniqueId,
	omit,
} from "solid-js";

import { type ListState, createListState, createSelectableList } from "../list";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import type { Collection, CollectionNode } from "../primitives";
import type {
	FocusStrategy,
	KeyboardDelegate,
	SelectionBehavior,
	SelectionMode,
} from "../selection";
import { ListboxContext, type ListboxContextValue } from "./listbox-context";

export interface ListboxRootOptions<Option, OptGroup = never> {
	/** The controlled value of the listbox. */
	value?: Iterable<string>;

	/**
	 * The value of the listbox when initially rendered.
	 * Useful when you do not need to control the state.
	 */
	defaultValue?: Iterable<string>;

	/** Event handler called when the value changes. */
	onChange?: (value: Set<string>) => void;

	/** An array of options to display as the available options. */
	options?: Array<Option | OptGroup>;

	/** Property name or getter function to use as the value of an option. */
	optionValue?: keyof Option | ((option: Option) => string);

	/** Property name or getter function to use as the text value of an option for typeahead purpose. */
	optionTextValue?: keyof Option | ((option: Option) => string);

	/** Property name or getter function to use as the disabled flag of an option. */
	optionDisabled?: keyof Option | ((option: Option) => boolean);

	/** Property name or getter function that refers to the children options of option group. */
	optionGroupChildren?: keyof OptGroup | ((optGroup: OptGroup) => Option[]);

	/** The controlled state of the listbox. */
	state?: ListState;

	/** An optional keyboard delegate implementation for type to select, to override the default. */
	keyboardDelegate?: KeyboardDelegate;

	/** Whether to autofocus the listbox or an option. */
	autoFocus?: boolean | FocusStrategy;

	/** Whether focus should wrap around when the end/start is reached. */
	shouldFocusWrap?: boolean;

	/** Whether the listbox items should use virtual focus instead of being focused directly. */
	shouldUseVirtualFocus?: boolean;

	/** Whether selection should occur on press up instead of press down. */
	shouldSelectOnPressUp?: boolean;

	/** Whether options should be focused when the user hovers over them. */
	shouldFocusOnHover?: boolean;

	/**
	 * The ref attached to the scrollable element, used to provide automatic scrolling on item focus.
	 * If not provided, defaults to the listbox ref.
	 */
	scrollRef?: Accessor<HTMLElement | undefined>;

	/** How multiple selection should behave in the listbox. */
	selectionBehavior?: SelectionBehavior;

	/** Whether onValueChange should fire even if the new set of keys is the same as the last. */
	allowDuplicateSelectionEvents?: boolean;

	/** The type of selection that is allowed in the listbox. */
	selectionMode?: SelectionMode;

	/** Whether the listbox allows empty selection. */
	disallowEmptySelection?: boolean;

	/** Whether selection should occur automatically on focus. */
	selectOnFocus?: boolean;

	/** Whether typeahead is disabled. */
	disallowTypeAhead?: boolean;

	/** Whether navigation through tab key is enabled. */
	allowsTabNavigation?: boolean;

	/** Whether the listbox uses virtual scrolling. */
	virtualized?: boolean;

	/** When NOT virtualized, a map function that receives an _item_ signal representing a listbox item. */
	renderItem?: (item: CollectionNode<Option>) => JSX.Element;

	/** When NOT virtualized, a map function that receives a _section_ signal representing a listbox section. */
	renderSection?: (section: CollectionNode<OptGroup>) => JSX.Element;

	/** When virtualized, the Virtualizer function used to scroll to the item of the given key. */
	scrollToItem?: (key: string) => void;

	/** When virtualized, a map function that receives an _items_ signal representing all listbox items and sections. */
	children?: (
		items: Accessor<Collection<CollectionNode<Option | OptGroup>>>,
	) => JSX.Element;
}

export interface ListboxRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocusIn: JSX.EventHandlerUnion<T, FocusEvent>;
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface ListboxRootRenderProps extends ListboxRootCommonProps {
	role: "listbox";
	children: JSX.Element;
	tabIndex: number | undefined;
}

export type ListboxRootProps<
	Option,
	OptGroup = never,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ListboxRootOptions<Option, OptGroup> &
	Partial<ListboxRootCommonProps<ElementOf<T>>>;

/**
 * Listbox presents a list of options and allows a user to select one or more of them.
 */
export function ListboxRoot<
	Option,
	OptGroup = never,
	T extends ValidComponent = "ul",
>(props: PolymorphicProps<T, ListboxRootProps<Option, OptGroup, T>>) {
	let ref: HTMLElement | undefined;

	const defaultId = `listbox-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			selectionMode: "single",
			virtualized: false,
		} as const,
		props as ListboxRootProps<Option, OptGroup>,
	);

	const others = omit(mergedProps, "ref", "children", "renderItem", "renderSection", "value", "defaultValue", "onChange", "options", "optionValue", "optionTextValue", "optionDisabled", "optionGroupChildren", "state", "keyboardDelegate", "autoFocus", "selectionMode", "shouldFocusWrap", "shouldUseVirtualFocus", "shouldSelectOnPressUp", "shouldFocusOnHover", "allowDuplicateSelectionEvents", "disallowEmptySelection", "selectionBehavior", "selectOnFocus", "disallowTypeAhead", "allowsTabNavigation", "virtualized", "scrollToItem", "scrollRef", "onKeyDown", "onMouseDown", "onFocusIn", "onFocusOut");

	const listState = createMemo(() => {
		if (mergedProps.state) {
			return mergedProps.state;
		}

		return createListState({
			selectedKeys: () => mergedProps.value,
			defaultSelectedKeys: () => mergedProps.defaultValue,
			onSelectionChange: mergedProps.onChange,
			allowDuplicateSelectionEvents: () =>
				access(mergedProps.allowDuplicateSelectionEvents),
			disallowEmptySelection: () => access(mergedProps.disallowEmptySelection),
			selectionBehavior: () => access(mergedProps.selectionBehavior),
			selectionMode: () => access(mergedProps.selectionMode),
			dataSource: () => mergedProps.options ?? [],
			getKey: () => mergedProps.optionValue as any,
			getTextValue: () => mergedProps.optionTextValue as any,
			getDisabled: () => mergedProps.optionDisabled as any,
			getSectionChildren: () => mergedProps.optionGroupChildren as any,
		});
	});

	const selectableList = createSelectableList(
		{
			selectionManager: () => listState().selectionManager(),
			collection: () => listState().collection(),
			autoFocus: () => access(mergedProps.autoFocus),
			shouldFocusWrap: () => access(mergedProps.shouldFocusWrap),
			keyboardDelegate: () => mergedProps.keyboardDelegate,
			disallowEmptySelection: () => access(mergedProps.disallowEmptySelection),
			selectOnFocus: () => access(mergedProps.selectOnFocus),
			disallowTypeAhead: () => access(mergedProps.disallowTypeAhead),
			shouldUseVirtualFocus: () => access(mergedProps.shouldUseVirtualFocus),
			allowsTabNavigation: () => access(mergedProps.allowsTabNavigation),
			isVirtualized: () => mergedProps.virtualized,
			scrollToKey: () => mergedProps.scrollToItem,
		},
		() => ref,
		() => mergedProps.scrollRef?.(),
	);

	const context: ListboxContextValue = {
		listState,
		generateId: createGenerateId(() => others.id!),
		shouldUseVirtualFocus: () => mergedProps.shouldUseVirtualFocus,
		shouldSelectOnPressUp: () => mergedProps.shouldSelectOnPressUp,
		shouldFocusOnHover: () => mergedProps.shouldFocusOnHover,
		isVirtualized: () => mergedProps.virtualized,
	};

	return (
		<ListboxContext value={context}>
			<Polymorphic<ListboxRootRenderProps>
				as="ul"
				ref={mergeRefs((el) => (ref = el), mergedProps.ref)}
				role="listbox"
				tabIndex={selectableList.tabIndex()}
				aria-multiselectable={
					listState().selectionManager().selectionMode() === "multiple"
						? true
						: undefined
				}
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
				{...others}
			>
				<Show
					when={!mergedProps.virtualized}
					fallback={mergedProps.children?.(listState().collection)}
				>
					<Key each={[...listState().collection()]} by="key">
						{(item) => (
							<Switch>
								<Match when={item().type === "section"}>
									{mergedProps.renderSection?.(item())}
								</Match>
								<Match when={item().type === "item"}>
									{mergedProps.renderItem?.(item())}
								</Match>
							</Switch>
						)}
					</Key>
				</Show>
			</Polymorphic>
		</ListboxContext>
	);
}
