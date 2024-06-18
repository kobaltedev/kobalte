/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/menu/src/useMenuSubTrigger.ts
 *
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */

import {
	type Orientation,
	callHandler,
	composeEventHandlers,
	focusWithoutScrolling,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createEffect,
	createUniqueId,
	on,
	onCleanup,
	splitProps,
} from "solid-js";
import { isServer } from "solid-js/web";

import { type Direction, useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createSelectableItem } from "../selection";
import { type MenuDataSet, useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";
import { type Side, getPointerGraceArea } from "./utils";

export interface MenuSubTriggerOptions {
	/**
	 * Optional text used for typeahead purposes.
	 * By default, the typeahead behavior will use the .textContent of the Menu.SubTrigger.
	 * Use this when the content is complex, or you have non-textual content inside.
	 */
	textValue?: string;

	/** Whether the sub menu trigger is disabled. */
	disabled?: boolean;
}

export interface MenuSubTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
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

export interface MenuSubTriggerRenderProps
	extends MenuSubTriggerCommonProps,
		MenuDataSet {
	role: "menuitem";
	tabIndex: number | undefined;
	"aria-haspopup": "true";
	"aria-expanded": boolean;
	"aria-controls": string | undefined;
	"aria-disabled": boolean | undefined;
	"data-key": string | undefined;
	"data-highlighted": "" | undefined;
	"data-disabled": "" | undefined;
}

export type MenuSubTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuSubTriggerOptions & Partial<MenuSubTriggerCommonProps<ElementOf<T>>>;

const SELECTION_KEYS = ["Enter", " "];
const SUB_OPEN_KEYS = {
	open: (dir: Direction, orientation: Orientation) => {
		if (dir === "ltr") {
			return [
				...SELECTION_KEYS,
				orientation === "horizontal" ? "ArrowRight" : "ArrowDown",
			];
		}
		return [
			...SELECTION_KEYS,
			orientation === "horizontal" ? "ArrowLeft" : "ArrowUp",
		];
	},
};

/**
 * An item that opens a submenu.
 */
export function MenuSubTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuSubTriggerProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const rootContext = useMenuRootContext();
	const context = useMenuContext();

	const mergedProps = mergeDefaultProps(
		{
			id: rootContext.generateId(`sub-trigger-${createUniqueId()}`),
		},
		props as MenuSubTriggerProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"id",
		"textValue",
		"disabled",
		"onPointerMove",
		"onPointerLeave",
		"onPointerDown",
		"onPointerUp",
		"onClick",
		"onKeyDown",
		"onMouseDown",
		"onFocus",
	]);

	let openTimeoutId: number | null = null;

	const clearOpenTimeout = () => {
		if (isServer) {
			return;
		}

		if (openTimeoutId) {
			window.clearTimeout(openTimeoutId);
		}

		openTimeoutId = null;
	};

	const { direction } = useLocale();

	const key = () => local.id!;

	const parentSelectionManager = () => {
		const parentMenuContext = context.parentMenuContext();

		if (parentMenuContext == null) {
			throw new Error(
				"[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component",
			);
		}

		return parentMenuContext.listState().selectionManager();
	};

	const collection = () => context.listState().collection();

	const isHighlighted = () => parentSelectionManager().focusedKey() === key();

	const selectableItem = createSelectableItem(
		{
			key,
			selectionManager: parentSelectionManager,
			shouldSelectOnPressUp: true,
			allowsDifferentPressOrigin: true,
			disabled: () => local.disabled,
		},
		() => ref,
	);

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		if (!context.isOpen() && !local.disabled) {
			context.open(true);
		}
	};

	const onPointerMove: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerMove);

		if (e.pointerType !== "mouse") {
			return;
		}

		const parentMenuContext = context.parentMenuContext();

		parentMenuContext?.onItemEnter(e);

		if (e.defaultPrevented) {
			return;
		}

		if (local.disabled) {
			parentMenuContext?.onItemLeave(e);
			return;
		}

		if (!context.isOpen() && !openTimeoutId) {
			context.parentMenuContext()?.setPointerGraceIntent(null);

			openTimeoutId = window.setTimeout(() => {
				context.open(false);
				clearOpenTimeout();
			}, 100);
		}

		parentMenuContext?.onItemEnter(e);

		if (!e.defaultPrevented) {
			// Remove visual focus from sub menu content.
			if (context.listState().selectionManager().isFocused()) {
				context.listState().selectionManager().setFocused(false);
				context.listState().selectionManager().setFocusedKey(undefined);
			}

			// Restore visual focus to parent menu content.
			focusWithoutScrolling(e.currentTarget);
			parentMenuContext?.listState().selectionManager().setFocused(true);
			parentMenuContext?.listState().selectionManager().setFocusedKey(key());
		}
	};

	const onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerLeave);

		if (e.pointerType !== "mouse") {
			return;
		}

		clearOpenTimeout();

		const parentMenuContext = context.parentMenuContext();

		const contentEl = context.contentRef();

		if (contentEl) {
			parentMenuContext?.setPointerGraceIntent({
				area: getPointerGraceArea(context.currentPlacement(), e, contentEl),
				// Safe because sub menu always open "left" or "right".
				side: context.currentPlacement().split("-")[0] as Side,
			});

			window.clearTimeout(parentMenuContext?.pointerGraceTimeoutId());

			const pointerGraceTimeoutId = window.setTimeout(() => {
				parentMenuContext?.setPointerGraceIntent(null);
			}, 300);

			parentMenuContext?.setPointerGraceTimeoutId(pointerGraceTimeoutId);
		} else {
			parentMenuContext?.onTriggerLeave(e);

			if (e.defaultPrevented) {
				return;
			}

			// There's 100ms where the user may leave an item before the submenu was opened.
			parentMenuContext?.setPointerGraceIntent(null);
		}

		parentMenuContext?.onItemLeave(e);
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

		// For consistency with native, open the menu on key down.
		if (
			SUB_OPEN_KEYS.open(direction(), rootContext.orientation()).includes(e.key)
		) {
			e.stopPropagation();
			e.preventDefault();

			// Clear focus on parent menu (e.g. the menu containing the trigger).
			parentSelectionManager().setFocused(false);
			parentSelectionManager().setFocusedKey(undefined);

			if (!context.isOpen()) {
				context.open("first");
			}

			// We focus manually because we prevented it in MenuSubContent's `onOpenAutoFocus`.
			context.focusContent();
			context.listState().selectionManager().setFocused(true);
			context
				.listState()
				.selectionManager()
				.setFocusedKey(collection().getFirstKey());
		}
	};

	createEffect(() => {
		// Not able to register the trigger as a menu item on parent menu means
		// `Menu.SubTrigger` is not used in the correct place, so throw an error.
		if (context.registerItemToParentDomCollection == null) {
			throw new Error(
				"[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component",
			);
		}

		// Register the item trigger on the parent menu that contains it.
		const unregister = context.registerItemToParentDomCollection({
			ref: () => ref,
			type: "item",
			key: key(),
			textValue: local.textValue ?? ref?.textContent ?? "",
			disabled: local.disabled ?? false,
		});

		onCleanup(unregister);
	});

	createEffect(
		on(
			() => context.parentMenuContext()?.pointerGraceTimeoutId(),
			(pointerGraceTimer) => {
				onCleanup(() => {
					window.clearTimeout(pointerGraceTimer);
					context.parentMenuContext()?.setPointerGraceIntent(null);
				});
			},
		),
	);

	createEffect(() => onCleanup(context.registerTriggerId(local.id!)));

	onCleanup(() => {
		clearOpenTimeout();
	});

	return (
		<Polymorphic<MenuSubTriggerRenderProps>
			as="div"
			ref={mergeRefs((el) => {
				context.setTriggerRef(el);
				ref = el;
			}, local.ref)}
			id={local.id}
			role="menuitem"
			tabIndex={selectableItem.tabIndex()}
			aria-haspopup="true"
			aria-expanded={context.isOpen()}
			aria-controls={context.isOpen() ? context.contentId() : undefined}
			aria-disabled={local.disabled}
			data-key={selectableItem.dataKey()}
			data-highlighted={isHighlighted() ? "" : undefined}
			data-disabled={local.disabled ? "" : undefined}
			onPointerDown={composeEventHandlers([
				local.onPointerDown,
				selectableItem.onPointerDown,
			])}
			onPointerUp={composeEventHandlers([
				local.onPointerUp,
				selectableItem.onPointerUp,
			])}
			onClick={composeEventHandlers([onClick, selectableItem.onClick])}
			onKeyDown={composeEventHandlers([onKeyDown, selectableItem.onKeyDown])}
			onMouseDown={composeEventHandlers([
				local.onMouseDown,
				selectableItem.onMouseDown,
			])}
			onFocus={composeEventHandlers([local.onFocus, selectableItem.onFocus])}
			onPointerMove={onPointerMove}
			onPointerLeave={onPointerLeave}
			{...context.dataset()}
			{...others}
		/>
	);
}
