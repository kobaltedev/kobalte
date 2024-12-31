/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/context-menu/src/ContextMenu.tsx
 */

import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { type JSX, type ValidComponent, onCleanup, splitProps } from "solid-js";
import { isServer } from "solid-js/web";

import { combineStyle } from "@solid-primitives/props";
import { type MenuDataSet, useMenuContext } from "../menu/menu-context";
import { useMenuRootContext } from "../menu/menu-root-context";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useContextMenuContext } from "./context-menu-context";

export interface ContextMenuTriggerOptions {
	/** Whether the context menu trigger is disabled. */
	disabled?: boolean;
}

export interface ContextMenuTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onContextMenu: JSX.EventHandlerUnion<T, MouseEvent>;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerCancel: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
	style?: JSX.CSSProperties | string;
}

export interface ContextMenuTriggerRenderProps
	extends ContextMenuTriggerCommonProps,
		MenuDataSet {}

export type ContextMenuTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ContextMenuTriggerOptions &
	Partial<ContextMenuTriggerCommonProps<ElementOf<T>>>;

export function ContextMenuTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ContextMenuTriggerProps<T>>,
) {
	const rootContext = useMenuRootContext();
	const menuContext = useMenuContext();
	const context = useContextMenuContext();

	const mergedProps = mergeDefaultProps(
		{
			id: rootContext.generateId("trigger"),
		},
		props as ContextMenuTriggerProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"style",
		"disabled",
		"onContextMenu",
		"onPointerDown",
		"onPointerMove",
		"onPointerCancel",
		"onPointerUp",
	]);

	let longPressTimoutId = 0;

	const clearLongPressTimeout = () => {
		if (isServer) {
			return;
		}

		window.clearTimeout(longPressTimoutId);
	};

	onCleanup(() => {
		clearLongPressTimeout();
	});

	const onContextMenu: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		// If trigger is disabled, enable the native Context Menu.
		if (local.disabled) {
			callHandler(e, local.onContextMenu);
			return;
		}

		// Clearing the long press here because some platforms already support
		// long press to trigger a `contextmenu` event.
		clearLongPressTimeout();

		e.preventDefault();
		e.stopPropagation();

		context.setAnchorRect({ x: e.clientX, y: e.clientY });

		if (menuContext.isOpen()) {
			// If the menu is already open, focus the menu itself.
			menuContext.focusContent();
		} else {
			menuContext.open(true);
		}
	};

	const isTouchOrPen = (e: PointerEvent) =>
		e.pointerType === "touch" || e.pointerType === "pen";

	const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		callHandler(e, local.onPointerDown);

		if (!local.disabled && isTouchOrPen(e)) {
			// Clear the long press here in case there's multiple touch points.
			clearLongPressTimeout();
			context.setAnchorRect({ x: e.clientX, y: e.clientY });
			longPressTimoutId = window.setTimeout(() => menuContext.open(false), 700);
		}
	};

	const onPointerMove: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerMove);

		if (!local.disabled && isTouchOrPen(e)) {
			clearLongPressTimeout();
		}
	};

	const onPointerCancel: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerCancel);

		if (!local.disabled && isTouchOrPen(e)) {
			clearLongPressTimeout();
		}
	};

	const onPointerUp: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (e) => {
		callHandler(e, local.onPointerUp);

		if (!local.disabled && isTouchOrPen(e)) {
			clearLongPressTimeout();
		}
	};

	return (
		<Polymorphic<ContextMenuTriggerRenderProps>
			as="div"
			ref={mergeRefs(menuContext.setTriggerRef, local.ref)}
			style={combineStyle(
				{
					// prevent iOS context menu from appearing
					"-webkit-touch-callout": "none",
				},
				local.style,
			)}
			data-disabled={local.disabled ? "" : undefined}
			onContextMenu={onContextMenu}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerCancel={onPointerCancel}
			onPointerUp={onPointerUp}
			{...menuContext.dataset()}
			{...others}
		/>
	);
}
