import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, ParentComponent } from "solid-js";

import { MenuRoot, MenuRootOptions } from "../menu";

export interface DropdownMenuRootOptions extends MenuRootOptions {}

/**
 * Displays a menu to the user —such as a set of actions or functions— triggered by a button.
 */
export const DropdownMenuRoot: ParentComponent<DropdownMenuRootOptions> = props => {
  const defaultId = `dropdownmenu-${createUniqueId()}`;

  props = mergeDefaultProps({ id: defaultId }, props);

  return <MenuRoot {...props} />;
};
