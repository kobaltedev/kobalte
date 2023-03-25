import { OverrideComponentProps } from "@kobalte/utils";
import { Component } from "solid-js";

import { AsChildProp } from "../polymorphic";
import {
  SelectBase,
  SelectBaseItemComponentProps,
  SelectBaseOptions,
  SelectBaseSectionComponentProps,
  SelectBaseValueComponentProps,
} from "../select/select-base";

export interface MultiSelectValueComponentProps<T> extends SelectBaseValueComponentProps<T> {}
export interface MultiSelectItemComponentProps<T> extends SelectBaseItemComponentProps<T> {}
export interface MultiSelectSectionComponentProps<T> extends SelectBaseSectionComponentProps<T> {}

export interface MultiSelectRootOptions<Option, OptGroup = never>
  extends Omit<
    SelectBaseOptions<Option, OptGroup>,
    "valueComponent" | "itemComponent" | "sectionComponent" | "selectionMode"
  > {
  /** The component to render inside `MultiSelect.Value`. */
  valueComponent?: Component<MultiSelectValueComponentProps<Option>>;

  /** When NOT virtualized, the component to render as an item in the `MultiSelect.Listbox`. */
  itemComponent?: Component<MultiSelectItemComponentProps<Option>>;

  /** When NOT virtualized, the component to render as a section in the `MultiSelect.Listbox`. */
  sectionComponent?: Component<MultiSelectSectionComponentProps<OptGroup>>;
}

export interface MultiSelectRootProps<Option, OptGroup = never>
  extends OverrideComponentProps<"div", MultiSelectRootOptions<Option, OptGroup>>,
    AsChildProp {}

/**
 * Displays a list of options for the user to pick multiples from — triggered by a button.
 */
export function MultiSelectRoot<Option, OptGroup = never>(
  props: MultiSelectRootProps<Option, OptGroup>
) {
  return <SelectBase selectionMode="multiple" disallowEmptySelection={false} {...props} />;
}
