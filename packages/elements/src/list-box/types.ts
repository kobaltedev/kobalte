import { Accessor } from "solid-js";

import { CollectionItem } from "../primitives";

export type ListBoxSelectionMode = "none" | "single" | "multiple";

export interface ListBoxItem extends CollectionItem {
  value: Accessor<string>;
  textValue: Accessor<string | undefined>;
  isDisabled?: Accessor<boolean | undefined>;
}
