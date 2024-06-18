import { mergeDefaultProps } from "@kobalte/utils";
import { type ParentProps, createUniqueId } from "solid-js";

import { MenuRoot, type MenuRootOptions } from "../menu";

export interface DropdownMenuRootOptions extends MenuRootOptions {}

export interface DropdownMenuRootProps
	extends ParentProps<DropdownMenuRootOptions> {}

/**
 * Displays a menu to the user —such as a set of actions or functions— triggered by a button.
 */
export function DropdownMenuRoot(props: DropdownMenuRootProps) {
	const defaultId = `dropdownmenu-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps({ id: defaultId }, props);

	return <MenuRoot {...mergedProps} />;
}
