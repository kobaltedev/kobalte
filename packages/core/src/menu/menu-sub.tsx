import { mergeDefaultProps } from "@kobalte/utils";
import { ParentProps } from "solid-js";

import { Menu, MenuProps } from "./menu";

/**
 * Root container for a sub menu, provide context for its children.
 */
export function MenuSub(props: ParentProps<MenuProps>) {
  props = mergeDefaultProps({ placement: "right-start" }, props);

  return <Menu {...props} />;
}
