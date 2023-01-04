import { ParentProps } from "solid-js";

import { Menu, MenuProps } from "./menu";

/**
 * Contains all the parts of a submenu.
 */
export function MenuSub(props: ParentProps<Omit<MenuProps, "placement" | "flip" | "sameWidth">>) {
  return <Menu placement="right-start" flip {...props} />;
}
