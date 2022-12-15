import { DomCollectionItem } from "../primitives/create-dom-collection";

export interface TabsItemModel extends DomCollectionItem {
  /** A unique key for the tab. */
  value: string;

  /** Whether the tab is disabled. */
  disabled?: boolean;
}

export type TabsActivationMode = "automatic" | "manual";
