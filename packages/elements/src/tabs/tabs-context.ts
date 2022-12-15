import { Orientation } from "@kobalte/utils";
import { Accessor, createContext, useContext } from "solid-js";

import { SingleSelectListState } from "../list";
import { TabsActivationMode } from "./types";

export interface TabsContextValue {
  isDisabled: Accessor<boolean>;
  orientation: Accessor<Orientation>;
  activationMode: Accessor<TabsActivationMode>;
  tabsIdsMap: Accessor<Map<string, string>>;
  tabPanelsIdsMap: Accessor<Map<string, string>>;
  listState: Accessor<SingleSelectListState>;
  generateTabId: (key: string) => string;
  generateTabPanelId: (key: string) => string;
}

export const TabsContext = createContext<TabsContextValue>();

export function useTabsContext() {
  const context = useContext(TabsContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useTabsContext` must be used within a `Tabs` component");
  }

  return context;
}
