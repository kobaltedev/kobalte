import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, ParentComponent, splitProps } from "solid-js";

import { useDomCollectionContext } from "../primitives/create-dom-collection/dom-collection-context";
import { Menu, MenuProps } from "./menu";
import { useMenuContext } from "./menu-context";
import { MenuSubContext, MenuSubContextValue } from "./menu-sub-context";

export interface MenuSubProps extends Omit<MenuProps, "onAction"> {
  /** A unique key for the sub menu trigger. */
  key: string;
}

export const MenuSub: ParentComponent<MenuSubProps> = props => {
  const parentDomCollectionContext = useDomCollectionContext();
  const parentMenuContext = useMenuContext();

  if (parentMenuContext === undefined) {
    throw new Error("[kobalte]: `Menu.Sub` must be used within a `Menu` component");
  }

  const defaultId = `menu-sub-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      placement: "right-start",
      trapFocus: false,
      autoFocus: false,
      restoreFocus: true,
      openDelay: 0,
      closeDelay: 0,
    },
    props
  );

  props = mergeDefaultProps({}, props);

  const [local, others] = splitProps(props, ["key"]);

  const context: MenuSubContextValue = {
    triggerKey: () => local.key,
    parentContext: () => parentMenuContext,
    registerSubTriggerToParent: parentDomCollectionContext.registerItem,
  };

  return (
    <MenuSubContext.Provider value={context}>
      <Menu onAction={parentMenuContext.onAction} {...others} />
    </MenuSubContext.Provider>
  );
};
