/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/menu/src/useMenuTrigger.ts
 */

import {
	callHandler,
	mergeDefaultProps,
	mergeRefs,
	scrollIntoViewport,
} from "@kobalte/utils";
import {
	Component,
	JSX,
	ValidComponent,
	createEffect,
	createMemo,
	onCleanup,
	splitProps,
	on,
} from "solid-js";

import * as Button from "../button";
import { useLocale } from "../i18n/i18n-provider";
import { Direction } from "../i18n/utils";
import { useOptionalMenubarContext } from "../menubar/menubar-context";
import { ElementOf, PolymorphicProps } from "../polymorphic";
import { createTagName } from "../primitives/create-tag-name";
import { MenuDataSet, useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuTriggerOptions {}

export interface MenuTriggerCommonProps<T extends HTMLElement = HTMLElement>
	extends Button.ButtonRootCommonProps<T> {
	id: string;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseOver: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface MenuTriggerRenderProps
	extends MenuTriggerCommonProps,
		Button.ButtonRootRenderProps,
		MenuDataSet {
	role: "menuitem" | undefined;
	"data-kb-menu-value-trigger": string | undefined;
}

export type MenuTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuTriggerOptions & Partial<MenuTriggerCommonProps<ElementOf<T>>>;

const MENUBAR_KEYS = {
	next: (dir: Direction) => dir === "ltr" ? "ArrowRight" : "ArrowLeft",
	previous: (dir: Direction) => MENUBAR_KEYS.next(dir === "ltr" ? "rtl" : "ltr"),
};

/**
 * The button that toggles the menu.
 */
export function MenuTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, MenuTriggerProps<T>>,
) {
	const rootContext = useMenuRootContext();
	const context = useMenuContext();
	const optionalMenubarContext = useOptionalMenubarContext();

	const { direction } = useLocale();

	const mergedProps = mergeDefaultProps(
		{
			id: rootContext.generateId("trigger"),
		},
		props as MenuTriggerProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"id",
		"disabled",
		"onPointerDown",
		"onClick",
		"onKeyDown",
		"onMouseOver",
		"onFocus",
	]);

	let key = rootContext.value();

	if (optionalMenubarContext !== undefined) {
		key = rootContext.value() ?? local.id!;
		if (optionalMenubarContext.lastValue() === undefined)
			optionalMenubarContext.setLastValue(key);
	}

	const tagName = createTagName(
		() => context.triggerRef(),
		() => "button",
	);

	const isNativeLink = createMemo(() => {
		return (
			tagName() === "a" && context.triggerRef()?.getAttribute("href") != null
		);
	});

	// When native link focus the trigger instead of the content when current menu is active.
	createEffect(on(() => optionalMenubarContext?.value(), (value) => {
		if (!isNativeLink()) return;
		if (value === key) context.triggerRef()?.focus();
	}));

	const handleClick = () => {
		// When opened by click, automatically focus Menubar menus
		optionalMenubarContext?.setAutoFocusMenu(true);

		// Don't auto focus element for Menubar
		if (optionalMenubarContext !== undefined) context.toggle(false);
		else context.toggle(true);

		if (
			optionalMenubarContext !== undefined &&
			!context.isOpen() &&
			optionalMenubarContext.value() === key
		) {
			optionalMenubarContext.closeMenu();
		}
	};

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerDown);

		e.currentTarget.dataset.pointerType = e.pointerType;

		// For consistency with native, open the select on mouse down (main button), but touch up.
		if (!local.disabled && e.pointerType !== "touch" && e.button === 0) {
			handleClick();
		}
	};

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		if (!local.disabled) {
			if (e.currentTarget.dataset.pointerType === "touch") handleClick();
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		if (local.disabled) {
			return;
		}

		if (isNativeLink()) {
			switch (e.key) {
				case "Enter":
				case " ":
					return;
			}
		}

		// For consistency with native, open the menu on key down.
		switch (e.key) {
			case "Enter":
			case " ":
			case "ArrowDown":
				e.stopPropagation();
				e.preventDefault();
				scrollIntoViewport(e.currentTarget);
				context.toggle("first");
				optionalMenubarContext?.setAutoFocusMenu(true);
				optionalMenubarContext?.setValue(key);
				break;
			case "ArrowUp":
				e.stopPropagation();
				e.preventDefault();
				context.toggle("last");
				break;
			case MENUBAR_KEYS.next(direction()):
				if (optionalMenubarContext === undefined) break;
				e.stopPropagation();
				e.preventDefault();
				optionalMenubarContext.nextMenu();
				break;
			case MENUBAR_KEYS.previous(direction()):
				if (optionalMenubarContext === undefined) break;
				e.stopPropagation();
				e.preventDefault();
				optionalMenubarContext.previousMenu();
				break;
		}
	};

	const onMouseOver: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onMouseOver);

		// When one of the menubar menus is open, automatically open others on trigger hover
		if (
			!local.disabled &&
			optionalMenubarContext !== undefined &&
			optionalMenubarContext.value() !== undefined
		) {
			optionalMenubarContext.setValue(key);
		}
	};

	const onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocus);

		if (optionalMenubarContext !== undefined)
			optionalMenubarContext.setValue(key);
	};

	createEffect(() => onCleanup(context.registerTriggerId(local.id!)));

	return (
		<Button.Root<
			Component<
				Omit<
					MenuTriggerRenderProps,
					Exclude<keyof Button.ButtonRootRenderProps, "role">
				>
			>
		>
			ref={mergeRefs(context.setTriggerRef, local.ref)}
		 	data-kb-menu-value-trigger={rootContext.value()}
			id={local.id}
			disabled={local.disabled}
			aria-haspopup="true"
			aria-expanded={context.isOpen()}
			aria-controls={context.isOpen() ? context.contentId() : undefined}
			data-highlighted={
				key !== undefined && optionalMenubarContext?.value() === key
					? true
					: undefined
			}
			tabIndex={
				optionalMenubarContext !== undefined
					? optionalMenubarContext.value() === key ||
					  optionalMenubarContext.lastValue() === key
						? 0
						: -1
					: undefined
			}
			onPointerDown={onPointerDown}
			onMouseOver={onMouseOver}
			onClick={onClick}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			role={optionalMenubarContext !== undefined ? "menuitem" : undefined}
			{...context.dataset()}
			{...others}
		/>
	);
}
