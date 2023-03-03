import { OverrideComponentProps } from "@kobalte/utils";

import { createPreventScroll } from "../primitives";
import { MenuContentBase, MenuContentBaseOptions } from "./menu-content-base";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuContentOptions extends MenuContentBaseOptions {}

export function MenuContent(props: OverrideComponentProps<"div", MenuContentOptions>) {
  const rootContext = useMenuRootContext();
  const context = useMenuContext();

  createPreventScroll({
    isDisabled: () => !(context.isOpen() && rootContext.isModal()),
  });

  return <MenuContentBase {...props} />;
}
