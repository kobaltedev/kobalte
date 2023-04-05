import { OverrideComponentProps } from "@kobalte/utils";
import { Component, createMemo, splitProps } from "solid-js";

import {
  MultiComboboxRootItemComponentProps,
  MultiComboboxRootOptions,
  MultiComboboxRootSectionComponentProps,
} from "../multi-combobox";
import { MultiComboboxRoot } from "../multi-combobox/multi-combobox-root";
import { AsChildProp } from "../polymorphic";

export interface ComboboxRootItemComponentProps<T> extends MultiComboboxRootItemComponentProps<T> {}
export interface ComboboxRootSectionComponentProps<T>
  extends MultiComboboxRootSectionComponentProps<T> {}

export interface ComboboxRootOptions<Option, OptGroup = never>
  extends Omit<
    MultiComboboxRootOptions<Option, OptGroup>,
    "itemComponent" | "sectionComponent" | "value" | "defaultValue" | "onChange" | "selectionMode"
  > {
  /** The controlled value of the select. */
  value?: string;

  /**
   * The value of the select when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: string;

  /** Event handler called when the value changes. */
  onChange?: (value: string) => void;

  /** When NOT virtualized, the component to render as an item in the `Combobox.Listbox`. */
  itemComponent?: Component<ComboboxRootItemComponentProps<Option>>;

  /** When NOT virtualized, the component to render as a section in the `Combobox.Listbox`. */
  sectionComponent?: Component<ComboboxRootSectionComponentProps<OptGroup>>;
}

export interface ComboboxRootProps<Option, OptGroup = never>
  extends OverrideComponentProps<"div", ComboboxRootOptions<Option, OptGroup>>,
    AsChildProp {}

/**
 * Displays a list of options for the user to pick from — triggered by a button.
 */
export function ComboboxRoot<Option, OptGroup = never>(props: ComboboxRootProps<Option, OptGroup>) {
  const [local, others] = splitProps(props, ["value", "defaultValue", "onChange"]);

  const value = createMemo(() => {
    return local.value != null ? new Set([local.value]) : undefined;
  });

  const defaultValue = createMemo(() => {
    return local.defaultValue != null ? new Set([local.defaultValue]) : undefined;
  });

  const onChange = (value: Set<string>) => {
    local.onChange?.(value.values().next().value);
  };

  return (
    <MultiComboboxRoot
      value={value()}
      defaultValue={defaultValue()}
      onChange={onChange}
      selectionMode="single"
      disallowEmptySelection
      {...others}
    />
  );
}
