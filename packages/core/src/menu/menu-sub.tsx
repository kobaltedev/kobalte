import { ParentProps } from "solid-js";

import { useLocale } from "../i18n";
import { Menu, MenuOptions } from "./menu";

export interface MenuSubOptions extends Omit<MenuOptions, "placement" | "flip" | "sameWidth"> {}

export interface MenuSubProps extends ParentProps<MenuSubOptions> {}

/**
 * Contains all the parts of a submenu.
 */
export function MenuSub(props: MenuSubProps) {
  const { direction } = useLocale();

  return <Menu placement={direction() === "rtl" ? "left-start" : "right-start"} flip {...props} />;
}
