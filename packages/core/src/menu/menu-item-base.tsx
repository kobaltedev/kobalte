/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */

import {
	callHandler,
	composeEventHandlers,
	createGenerateId,
	focusWithoutScrolling,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Accessor,
	type JSX,
	type ValidComponent,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type CollectionItemWithRef, createRegisterId } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useMenuContext } from "./menu-context";
import {
	MenuItemContext,
	type MenuItemContextValue,
	type MenuItemDataSet,
} from "./menu-item.context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuItemBaseOptions {
	/**
	 * Optional text used for typeahead purposes.
	 * By default, the typeahead behavior will use the .textContent of the Menu.ItemLabel part
	 * if provided, or fallback to the .textContent of the Menu.Item.
	 * Use this when the content is complex, or you have non-textual content inside.
	 */
	textValue?: string;

	/** Whether the menu item is disabled. */
	disabled?: boolean;

	/** Whether the menu item is checked (item radio or item checkbox). */
	checked?: boolean;

	/**
	 * When using menu item checkbox, whether the checked state is in an indeterminate mode.
	 * Indeterminism is presentational only.
	 * The indeterminate visual representation remains regardless of user interaction.
	 */
	indeterminate?: boolean;

	/** Whether the menu should close when the menu item is activated/selected. */
	closeOnSelect?: boolean;

	/** Event handler called when the user selects an item (via mouse or keyboard). */
	onSelect?: () => void;
}

export interface MenuItemBaseCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface MenuItemBaseRenderProps
	extends MenuItemBaseCommonProps,
		MenuItemDataSet {
	tabIndex: number | undefined;
	"aria-checked": boolean | "mixed" | undefined;
	"aria-disabled": boolean | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"data-key": string | undefined;
}

export type MenuItemBaseProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuItemBaseOptions & Partial<MenuItemBaseCommonProps<ElementOf<T>>>;

/**
 * Base component for a menu item.
 */
export function MenuItemBase<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuItemBaseProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const rootContext = useMenuRootContext();
	const menuContext = useMenuContext();

	const mergedProps = mergeDefaultProps(
		{
			id: rootContext.generateId(`item-${createUniqueId()}`),
		},
		props as MenuItemBaseProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"textValue",
		"disabled",
		"closeOnSelect",
		"checked",
		"indeterminate",
		"onSelect",
		"onPointerMove",
		"onPointerLeave",
		"onPointerDown",
		"onPointerUp",
		"onClick",
		"onKeyDown",
		"onMouseDown",
		"onFocus",
	]);

	const [labelId, setLabelId] = createSignal<string>();
	const [descriptionId, setDescriptionId] = createSignal<string>();
	const [labelRef, setLabelRef] = createSignal<HTMLElement>();

	const selectionManager = () => menuContext.listState().selectionManager();

	const key = () => others.id!;

	const isHighlighted = () => selectionManager().focusedKey() === key();

	const onSelect = () => {
		local.onSelect?.();

		if (local.closeOnSelect) {
			setTimeout(() => {
				menuContext.close(true);
			});
		}
	};

	createDomCollectionItem<CollectionItemWithRef>({
		getItem: () => ({
			ref: () => ref,
			type: "item",
			key: key(),
			textValue:
				local.textValue ?? labelRef()?.textContent ?? ref?.textContent ?? "",
			disabled: local.disabled ?? false,
		}),
	});

	const selectableItem = createSelectableItem(
		{
			key,
			selectionManager: selectionManager,
			shouldSelectOnPressUp: true,
			allowsDifferentPressOrigin: true,
			disabled: () => local.disabled,
		},
		() => ref,
	);

	/**
	 * We focus items on `pointerMove` to achieve the following:
	 *
	 * - Mouse over an item (it focuses)
	 * - Leave mouse where it is and use keyboard to focus a different item
	 * - Wiggle mouse without it leaving previously focused item
	 * - Previously focused item should re-focus
	 *
	 * If we used `mouseOver`/`mouseEnter` it would not re-focus when the mouse
	 * wiggles. This is to match native menu implementation.
	 */
	const onPointerMove: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerMove);

		if (e.pointerType !== "mouse") {
			return;
		}

		if (local.disabled) {
			menuContext.onItemLeave(e);
		} else {
			menuContext.onItemEnter(e);

			if (!e.defaultPrevented) {
				focusWithoutScrolling(e.currentTarget);
				menuContext.listState().selectionManager().setFocused(true);
				menuContext.listState().selectionManager().setFocusedKey(key());
			}
		}
	};

	const onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerLeave);

		if (e.pointerType !== "mouse") {
			return;
		}

		menuContext.onItemLeave(e);
	};

	const onPointerUp: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (e) => {
		callHandler(e, local.onPointerUp);

		// Selection occurs on pointer up (main button).
		if (!local.disabled && e.button === 0) {
			onSelect();
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		// Ignore repeating events, which may have started on the menu trigger before moving
		// focus to the menu item. We want to wait for a second complete key press sequence.
		if (e.repeat) {
			return;
		}

		if (local.disabled) {
			return;
		}

		switch (e.key) {
			case "Enter":
			case " ":
				onSelect();
				break;
		}
	};

	const ariaChecked = createMemo(() => {
		if (local.indeterminate) {
			return "mixed";
		}

		if (local.checked == null) {
			return undefined;
		}

		return local.checked;
	});

	const dataset: Accessor<MenuItemDataSet> = createMemo(() => ({
		"data-indeterminate": local.indeterminate ? "" : undefined,
		"data-checked": local.checked && !local.indeterminate ? "" : undefined,
		"data-disabled": local.disabled ? "" : undefined,
		"data-highlighted": isHighlighted() ? "" : undefined,
	}));

	const context: MenuItemContextValue = {
		isChecked: () => local.checked,
		dataset,
		setLabelRef,
		generateId: createGenerateId(() => others.id!),
		registerLabel: createRegisterId(setLabelId),
		registerDescription: createRegisterId(setDescriptionId),
	};

	return (
		<MenuItemContext.Provider value={context}>
			<Polymorphic<MenuItemBaseRenderProps>
				as="div"
				ref={mergeRefs((el) => (ref = el), local.ref)}
				tabIndex={selectableItem.tabIndex()}
				aria-checked={ariaChecked()}
				aria-disabled={local.disabled}
				aria-labelledby={labelId()}
				aria-describedby={descriptionId()}
				data-key={selectableItem.dataKey()}
				onPointerDown={composeEventHandlers([
					local.onPointerDown,
					selectableItem.onPointerDown,
				])}
				onPointerUp={composeEventHandlers([
					onPointerUp,
					selectableItem.onPointerUp,
				])}
				onClick={composeEventHandlers([local.onClick, selectableItem.onClick])}
				onKeyDown={composeEventHandlers([onKeyDown, selectableItem.onKeyDown])}
				onMouseDown={composeEventHandlers([
					local.onMouseDown,
					selectableItem.onMouseDown,
				])}
				onFocus={composeEventHandlers([local.onFocus, selectableItem.onFocus])}
				onPointerMove={onPointerMove}
				onPointerLeave={onPointerLeave}
				{...dataset()}
				{...others}
			/>
		</MenuItemContext.Provider>
	);
}
