import { DomCollectionItem } from "../primitives";

export interface ListBoxItem extends DomCollectionItem {
  /** A unique value for the item. */
  value: string;

  /** Optional text used for typeahead purposes. */
  textValue: string;

  /** Whether the item is disabled. */
  isDisabled: boolean;
}
