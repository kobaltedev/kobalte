import { Accessor, createContext, useContext } from "solid-js";

import { MenuContextValue } from "./menu-context";
import { MenuItemModel } from "./types";

export interface MenuSubContextValue {
  triggerKey: Accessor<string>;
  parentMenuContext: Accessor<MenuContextValue>;
  registerSubTriggerToParent: (item: MenuItemModel) => () => void;
}

export const MenuSubContext = createContext<MenuSubContextValue>();

export function useOptionalMenuSubContext() {
  return useContext(MenuSubContext);
}

export function useMenuSubContext() {
  const context = useOptionalMenuSubContext();

  if (context === undefined) {
    throw new Error("[kobalte]: `useMenuSubContext` must be used within a `Menu.Sub` component");
  }

  return context;
}
