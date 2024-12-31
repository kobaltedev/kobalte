/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/context-menu/src/ContextMenu.tsx
 */

import { mergeDefaultProps } from "@kobalte/utils";
import {
	type ParentProps,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import { useLocale } from "../i18n";
import { MenuRoot, type MenuRootOptions } from "../menu";
import { createDisclosureState } from "../primitives";
import {
	ContextMenuContext,
	type ContextMenuContextValue,
} from "./context-menu-context";

export interface ContextMenuRootOptions
	extends Omit<MenuRootOptions, "open" | "defaultOpen" | "getAnchorRect"> {}

export interface ContextMenuRootProps
	extends ParentProps<ContextMenuRootOptions> {}

/**
 * Displays a menu located at the pointer, triggered by a right-click or a long-press.
 */
export function ContextMenuRoot(props: ContextMenuRootProps) {
	const defaultId = `contextmenu-${createUniqueId()}`;

	const { direction } = useLocale();

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			placement: direction() === "rtl" ? "left-start" : "right-start",
			gutter: 2,
			shift: 2,
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, ["onOpenChange"]);

	const [anchorRect, setAnchorRect] = createSignal({ x: 0, y: 0 });

	const disclosureState = createDisclosureState({
		defaultOpen: false,
		onOpenChange: (isOpen) => local.onOpenChange?.(isOpen),
	});

	const context: ContextMenuContextValue = {
		setAnchorRect,
	};

	return (
		<ContextMenuContext.Provider value={context}>
			<MenuRoot
				open={disclosureState.isOpen()}
				onOpenChange={disclosureState.setIsOpen}
				getAnchorRect={anchorRect}
				{...others}
			/>
		</ContextMenuContext.Provider>
	);
}
