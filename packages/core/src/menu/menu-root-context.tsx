import { Accessor, createContext, useContext } from "solid-js";

export interface MenuRootContextValue {
  isModal: Accessor<boolean>;
  forceMount: Accessor<boolean>;
  generateId: (part: string) => string;
}

export const MenuRootContext = createContext<MenuRootContextValue>();

export function useMenuRootContext() {
  const context = useContext(MenuRootContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useMenuRootContext` must be used within a `MenuRoot` component");
  }

  return context;
}
