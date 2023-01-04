import { ParentProps } from "solid-js";

import { useLocale } from "../i18n";
import { Menu, MenuProps } from "./menu";

/**
 * Contains all the parts of a submenu.
 */
export function MenuSub(props: ParentProps<Omit<MenuProps, "placement" | "flip" | "sameWidth">>) {
  const { direction } = useLocale();

  return <Menu placement={direction() === "rtl" ? "left-start" : "right-start"} flip {...props} />;
}
