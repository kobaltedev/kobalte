import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, omit, type ParentProps } from "solid-js";

import { MenuRoot, type MenuRootOptions } from "../menu";
import { useMenubarContext } from "./menubar-context";

export interface MenubarMenuOptions extends MenuRootOptions {}

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

	const others = omit(mergedProps, "value");

	const uniqueid = createUniqueId();

	const defaultId = menubarContext.generateId(`menubar-menu-${uniqueid}`);

	const mergedPropsWithId = mergeDefaultProps({ id: defaultId }, others);

	return (
		<MenuRoot value={mergedProps.value ?? uniqueid} {...mergedPropsWithId} />
	);
}
