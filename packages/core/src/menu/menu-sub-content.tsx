/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */

import {
	type Orientation,
	OverrideComponentProps,
	callHandler,
	contains,
	focusWithoutScrolling,
} from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";

import { type Direction, useLocale } from "../i18n";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import type { FocusOutsideEvent } from "../primitives";
import {
	MenuContentBase,
	type MenuContentBaseCommonProps,
	type MenuContentBaseOptions,
	type MenuContentBaseRenderProps,
} from "./menu-content-base";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuSubContentOptions
	extends Omit<
		MenuContentBaseOptions,
		"onOpenAutoFocus" | "onCloseAutoFocus"
	> {}

export interface MenuSubContentCommonProps<T extends HTMLElement = HTMLElement>
	extends MenuContentBaseCommonProps<T> {
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface MenuSubContentRenderProps
	extends MenuSubContentCommonProps,
		MenuContentBaseRenderProps {}

export type MenuSubContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuSubContentOptions & Partial<MenuSubContentCommonProps<ElementOf<T>>>;

const SUB_CLOSE_KEYS = {
	close: (dir: Direction, orientation: Orientation) => {
		if (dir === "ltr") {
			return [orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"];
		}
		return [orientation === "horizontal" ? "ArrowRight" : "ArrowDown"];
	},
};

/**
 * The component that pops out when a submenu is open.
 */
export function MenuSubContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuSubContentProps<T>>,
) {
	const context = useMenuContext();
	const rootContext = useMenuRootContext();

	const [local, others] = splitProps(props as MenuSubContentProps, [
		"onFocusOutside",
		"onKeyDown",
	]);

	const { direction } = useLocale();

	const onOpenAutoFocus = (e: Event) => {
		// when opening a submenu, focus content for keyboard users only (handled by `MenuSubTrigger`).
		e.preventDefault();
	};

	const onCloseAutoFocus = (e: Event) => {
		// The menu might close because of focusing another menu item in the parent menu.
		// We don't want it to refocus the trigger in that case, so we handle trigger focus ourselves.
		e.preventDefault();
	};

	const onFocusOutside = (e: FocusOutsideEvent) => {
		local.onFocusOutside?.(e);

		const target = e.target as HTMLElement | null;

		// We prevent closing when the trigger is focused to avoid triggering a re-open animation
		// on pointer interaction.
		if (!contains(context.triggerRef(), target)) {
			context.close();
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		// Submenu key events bubble through portals. We only care about keys in this menu.
		const isKeyDownInside = contains(e.currentTarget, e.target);
		const isCloseKey = SUB_CLOSE_KEYS.close(
			direction(),
			rootContext.orientation(),
		).includes(e.key);
		const isSubMenu = context.parentMenuContext() != null;

		if (isKeyDownInside && isCloseKey && isSubMenu) {
			context.close();

			// We focus manually because we prevented it in `onCloseAutoFocus`.
			focusWithoutScrolling(context.triggerRef());
		}
	};

	return (
		<MenuContentBase<
			Component<
				Omit<MenuSubContentRenderProps, keyof MenuContentBaseRenderProps>
			>
		>
			onOpenAutoFocus={onOpenAutoFocus}
			onCloseAutoFocus={onCloseAutoFocus}
			onFocusOutside={onFocusOutside}
			onKeyDown={onKeyDown}
			{...others}
		/>
	);
}
