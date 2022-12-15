import { DomCollectionItem } from "../primitives/create-dom-collection";

export interface TabsItemModel extends DomCollectionItem {
  /** A unique key for the item. */
  key: string;

  /** Whether the item is disabled. */
  disabled?: boolean;
}

export type TabsActivationMode = "automatic" | "manual";
