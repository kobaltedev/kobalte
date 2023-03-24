import { Orientation } from "@kobalte/utils";
import { Accessor, createContext, Setter, useContext } from "solid-js";

import { SingleSelectListState } from "../list";
import { TabsActivationMode } from "./types";

export interface TabsContextValue {
  isDisabled: Accessor<boolean>;
  orientation: Accessor<Orientation>;
  activationMode: Accessor<TabsActivationMode>;
  triggerIdsMap: Accessor<Map<string, string>>;
  contentIdsMap: Accessor<Map<string, string>>;
  listState: Accessor<SingleSelectListState>;
  selectedTab: Accessor<HTMLElement | undefined>;
  setSelectedTab: Setter<HTMLElement | undefined>;
  generateTriggerId: (value: string) => string;
  generateContentId: (value: string) => string;
}

export const TabsContext = createContext<TabsContextValue>();

export function useTabsContext() {
  const context = useContext(TabsContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useTabsContext` must be used within a `Tabs` component");
  }

  return context;
}
