import { ParentProps } from "solid-js";

import { Menu, MenuProps } from "./menu";

export function MenuSub(props: ParentProps<Omit<MenuProps, "placement" | "flip">>) {
  return <Menu placement="right-start" flip {...props} />;
}
