/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/context-menu/src/ContextMenu.tsx
 */

import { Component, splitProps, ValidComponent } from "solid-js";

import { MenuContent, MenuContentCommonProps, MenuContentOptions, MenuContentRenderProps } from "../menu";
import { useMenuRootContext } from "../menu/menu-root-context";
import { PolymorphicProps } from "../polymorphic";
import { InteractOutsideEvent } from "../primitives";


export interface ContextMenuContentOptions extends MenuContentOptions {
}

export interface ContextMenuContentCommonProps extends MenuContentCommonProps {
}

export interface ContextMenuContentRenderProps extends ContextMenuContentCommonProps, MenuContentRenderProps {}

export type ContextMenuContentProps = ContextMenuContentOptions & Partial<ContextMenuContentCommonProps>;

export function ContextMenuContent<T extends ValidComponent = "div">(props: PolymorphicProps<T, ContextMenuContentProps>) {
	const rootContext = useMenuRootContext();

	const [local, others] = splitProps(props, [
		"onCloseAutoFocus",
		"onInteractOutside",
	]);

	let hasInteractedOutside = false;

	const onCloseAutoFocus = (e: Event) => {
		local.onCloseAutoFocus?.(e);

		if (!e.defaultPrevented && hasInteractedOutside) {
			e.preventDefault();
		}

		hasInteractedOutside = false;
	};

	const onInteractOutside = (e: InteractOutsideEvent) => {
		local.onInteractOutside?.(e);

		if (!e.defaultPrevented && !rootContext.isModal()) {
			hasInteractedOutside = true;
		}
	};

	return (
		<MenuContent<Component<Omit<ContextMenuContentRenderProps, keyof MenuContentRenderProps>>>
			onCloseAutoFocus={onCloseAutoFocus}
			onInteractOutside={onInteractOutside}
			{...others}
		/>
	);
}
