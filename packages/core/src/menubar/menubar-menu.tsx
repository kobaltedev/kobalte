import { mergeDefaultProps } from "@kobalte/utils";
import { ParentProps, createUniqueId, splitProps } from "solid-js";

import { MenuRoot, MenuRootOptions } from "../menu";
import { useMenubarContext } from "./menubar-context";

export interface MenubarMenuOptions extends MenuRootOptions {
	/**
	 * Whether the menu should be the only visible content for screen readers.
	 * When set to `true`:
	 * - interaction with outside elements will be disabled.
	 * - scroll will be locked.
	 * - focus will be locked inside the menu content.
	 * - elements outside the menu content will not be visible for screen readers.
	 * Default false
	 */
	modal?: boolean;
}

export interface MenubarMenuProps extends ParentProps<MenubarMenuOptions> {}

/**
 * Displays a menu to the user —such as a set of actions or functions— triggered by a button.
 */
export function MenubarMenu(props: MenubarMenuProps) {
	const menubarContext = useMenubarContext();

	const mergedProps = mergeDefaultProps(
		{
			modal: false,
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, ["value"]);

	const uniqueid = createUniqueId();

	const defaultId = menubarContext.generateId(`menubar-menu-${uniqueid}`);

	const mergedPropsWithId = mergeDefaultProps({ id: defaultId }, mergedProps);

	return <MenuRoot value={local.value ?? uniqueid} {...mergedPropsWithId} />;
}
