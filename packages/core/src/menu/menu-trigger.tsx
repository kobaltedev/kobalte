/*!
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
	OverrideComponentProps,
} from "@kobalte/utils";
import {
	createDeferred,
	createEffect,
	createSignal,
	JSX,
	onCleanup,
	splitProps,
} from "solid-js";

import * as Button from "../button";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";
import { useOptionalMenubarContext } from "../menubar/menubar-context";

export interface MenuTriggerOptions extends Button.ButtonRootOptions {}

export interface MenuTriggerProps
	extends OverrideComponentProps<"button", MenuTriggerOptions> {}

/**
 * The button that toggles the menu.
 */
export function MenuTrigger(props: MenuTriggerProps) {
	let ref: HTMLButtonElement | undefined;

	const rootContext = useMenuRootContext();
	const context = useMenuContext();
	const optionalMenubarContext = useOptionalMenubarContext();

	props = mergeDefaultProps(
		{
			id: rootContext.generateId("trigger"),
		},
		props,
	);

	const [local, others] = splitProps(props, [
		"ref",
		"id",
		"disabled",
		"onPointerDown",
		"onClick",
		"onKeyDown",
		"onMouseOver",
		"onFocus",
	]);

	let key: string | undefined;

	if (optionalMenubarContext !== undefined) {
		key = rootContext.value() ?? local.id!;

		createEffect(() => {
			optionalMenubarContext.registerMenu(key!, [
				context.contentRef() ?? ref!,
				...context.nestedMenus(),
			]);
		});

		createEffect(() => {
			if (optionalMenubarContext.value() === key) {
				ref?.focus();
				if (optionalMenubarContext.autoFocusMenu()) context.open(true);
			} else context.close(true);
		});

		createEffect(() => {
			if (context.isOpen()) optionalMenubarContext.setValue(key);
		});

		onCleanup(() => {
			optionalMenubarContext.unregisterMenu(key!);
		});

		if (optionalMenubarContext.lastValue() === undefined)
			optionalMenubarContext.setLastValue(key);
	}

	const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		callHandler(e, local.onPointerDown);

		e.currentTarget.dataset.pointerType = e.pointerType;

		// For consistency with native, open the select on mouse down (main button), but touch up.
		if (!local.disabled && e.pointerType !== "touch" && e.button === 0) {
			// When opened by click, automatically focus Menubar menus
			optionalMenubarContext?.setAutoFocusMenu(true);

			// Don't auto focus element for Menubar
			if (optionalMenubarContext !== undefined) context.toggle(false);
			else context.toggle(true);
		}
	};

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		if (!local.disabled) {
			if (e.currentTarget.dataset.pointerType === "touch") context.toggle(true);
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = (
		e,
	) => {
		callHandler(e, local.onKeyDown);

		if (local.disabled) {
			return;
		}

		// For consistency with native, open the menu on key down.
		switch (e.key) {
			case "Enter":
			case " ":
			case "ArrowDown":
				e.stopPropagation();
				e.preventDefault();
				context.toggle("first");
				break;
			case "ArrowUp":
				e.stopPropagation();
				e.preventDefault();
				context.toggle("last");
				break;
			case "ArrowRight":
				if (optionalMenubarContext === undefined) break;
				e.stopPropagation();
				e.preventDefault();
				optionalMenubarContext.nextMenu();
				break;
			case "ArrowLeft":
				if (optionalMenubarContext === undefined) break;
				e.stopPropagation();
				e.preventDefault();
				optionalMenubarContext.previousMenu();
				break;
		}
	};

	const onMouseOver: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
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

	const onFocus: JSX.EventHandlerUnion<any, FocusEvent> = (e) => {
		callHandler(e, local.onFocus);

		if (optionalMenubarContext !== undefined)
			optionalMenubarContext.setValue(key);
	};

	createEffect(() => onCleanup(context.registerTriggerId(local.id!)));

	const [tabIndex, setTabIndex] = createSignal<undefined | 0 | -1>(undefined);

	return (
		<Button.Root
			ref={mergeRefs(context.setTriggerRef, local.ref)}
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
