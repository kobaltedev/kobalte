import { OverrideComponentProps } from "@kobalte/utils";
import { Component } from "solid-js";

import {
  ComboboxBase,
  ComboboxBaseItemComponentProps,
  ComboboxBaseOptions,
  ComboboxBaseSectionComponentProps,
  ComboboxBaseValueComponentProps,
} from "../combobox/combobox-base";
import { AsChildProp } from "../polymorphic";

export interface MultiComboboxValueComponentProps<T> extends ComboboxBaseValueComponentProps<T> {}
export interface MultiComboboxItemComponentProps<T> extends ComboboxBaseItemComponentProps<T> {}
export interface MultiComboboxSectionComponentProps<T>
  extends ComboboxBaseSectionComponentProps<T> {}

export interface MultiComboboxRootOptions<Option, OptGroup = never>
  extends Omit<
    ComboboxBaseOptions<Option, OptGroup>,
    "valueComponent" | "itemComponent" | "sectionComponent" | "selectionMode"
  > {
  /** The component to render inside `MultiCombobox.Value`. */
  valueComponent?: Component<MultiComboboxValueComponentProps<Option>>;

  /** When NOT virtualized, the component to render as an item in the `MultiCombobox.Listbox`. */
  itemComponent?: Component<MultiComboboxItemComponentProps<Option>>;

  /** When NOT virtualized, the component to render as a section in the `MultiCombobox.Listbox`. */
  sectionComponent?: Component<MultiComboboxSectionComponentProps<OptGroup>>;
}

export interface MultiComboboxRootProps<Option, OptGroup = never>
  extends OverrideComponentProps<"div", MultiComboboxRootOptions<Option, OptGroup>>,
    AsChildProp {}

export function MultiComboboxRoot<Option, OptGroup = never>(
  props: MultiComboboxRootProps<Option, OptGroup>
) {
  return <ComboboxBase selectionMode="multiple" disallowEmptySelection={false} {...props} />;
}
