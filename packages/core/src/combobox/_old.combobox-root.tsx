import { OverrideComponentProps } from "@kobalte/utils";
import { Component, createMemo, splitProps } from "solid-js";

import { AsChildProp } from "../polymorphic";
import {
  ComboboxBase,
  ComboboxBaseItemComponentProps,
  ComboboxBaseOptions,
  ComboboxBaseSectionComponentProps,
} from "./combobox-base";

export interface ComboboxRootItemComponentProps<T> extends ComboboxBaseItemComponentProps<T> {}
export interface ComboboxRootSectionComponentProps<T>
  extends ComboboxBaseSectionComponentProps<T> {}

export interface ComboboxRootOptions<Option, OptGroup = never>
  extends Omit<
    ComboboxBaseOptions<Option, OptGroup>,
    | "itemComponent"
    | "sectionComponent"
    | "value"
    | "defaultValue"
    | "onChange"
    | "selectionMode"
    | "displayValue"
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

  /** The string representation of the selected value to display in the `Combobox.Input`.  */
  displayValue?: (value: string) => string;

  /** When NOT virtualized, the component to render as an item in the `Combobox.Listbox`. */
  itemComponent?: Component<ComboboxRootItemComponentProps<Option>>;

  /** When NOT virtualized, the component to render as a section in the `Combobox.Listbox`. */
  sectionComponent?: Component<ComboboxRootSectionComponentProps<OptGroup>>;
}

export interface ComboboxRootProps<Option, OptGroup = never>
  extends OverrideComponentProps<"div", ComboboxRootOptions<Option, OptGroup>>,
    AsChildProp {}

/**
 * An  input widget with an associated popup that enables users to select a value from a collection of possible values.
 */
export function ComboboxRoot<Option, OptGroup = never>(props: ComboboxRootProps<Option, OptGroup>) {
  const [local, others] = splitProps(props, ["value", "defaultValue", "onChange", "displayValue"]);

  const value = createMemo(() => {
    return local.value != null ? new Set([local.value]) : undefined;
  });

  const defaultValue = createMemo(() => {
    return local.defaultValue != null ? new Set([local.defaultValue]) : undefined;
  });

  const onChange = (value: Set<string>) => {
    local.onChange?.(value.values().next().value);
  };

  const displayValue = (value: Set<string>) => {
    return local.displayValue?.(value.values().next().value) ?? "";
  };

  return (
    <ComboboxBase
      value={value()}
      defaultValue={defaultValue()}
      onChange={onChange}
      selectionMode="single"
      disallowEmptySelection
      displayValue={displayValue}
      {...others}
    />
  );
}
