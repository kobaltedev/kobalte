import { mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { createPreventScroll } from "../primitives";
import { MenuContentBase, MenuContentBaseOptions } from "./menu-content-base";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuContentOptions extends MenuContentBaseOptions {}

export interface MenuContentProps extends OverrideComponentProps<"div", MenuContentOptions> {}

export function MenuContent(props: MenuContentProps) {
  let ref: HTMLElement | undefined;

  const rootContext = useMenuRootContext();
  const context = useMenuContext();

  const [local, others] = splitProps(props, ["ref"]);

  createPreventScroll({
    ownerRef: () => ref,
    isDisabled: () => !(context.isOpen() && rootContext.isModal()),
  });

  return <MenuContentBase ref={mergeRefs(el => (ref = el), local.ref)} {...others} />;
}
