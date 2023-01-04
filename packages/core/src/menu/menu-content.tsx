import { createPolymorphicComponent } from "@kobalte/utils";

import { createPreventScroll } from "../primitives";
import { MenuContentBase, MenuContentBaseOptions } from "./menu-content-base";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuContentOptions extends MenuContentBaseOptions {}

export const MenuContent = createPolymorphicComponent<"div", MenuContentOptions>(props => {
  const rootContext = useMenuRootContext();
  const context = useMenuContext();

  createPreventScroll({
    isDisabled: () => !(context.isOpen() && rootContext.isModal()),
  });

  return <MenuContentBase {...props} />;
});
