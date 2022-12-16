import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, ParentComponent } from "solid-js";

import { MenuBase, MenuBaseProps } from "./menu-base";
import { useMenuContext } from "./menu-context";

export interface MenuSubProps
  extends Omit<
    MenuBaseProps,
    "onAction" | "isModal" | "preventScroll" | "trapFocus" | "autoFocus" | "restoreFocus"
  > {}

/**
 * Contains all the parts of a submenu.
 */
export const MenuSub: ParentComponent<MenuSubProps> = props => {
  const parentMenuContext = useMenuContext();

  if (parentMenuContext === undefined) {
    throw new Error("[kobalte]: `Menu.Sub` must be used within a `Menu` component");
  }

  const defaultId = `menu-sub-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      placement: "right-start",
    },
    props
  );

  return (
    <MenuBase
      isModal={parentMenuContext.isModal()}
      preventScroll={parentMenuContext.preventScroll()}
      trapFocus={parentMenuContext.trapFocus()}
      autoFocus={false}
      restoreFocus={true}
      onAction={parentMenuContext.onAction}
      {...props}
    />
  );
};
