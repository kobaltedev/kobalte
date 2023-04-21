import { OverrideComponentProps } from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";

import { AsChildProp } from "../polymorphic";
import { ComboboxBase, ComboboxBaseOptions } from "./combobox-base";

export interface ComboboxSingleSelectionOptions<T> {
  /** The controlled value of the combobox. */
  value?: T;

  /**
   * The value of the combobox when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: T;

  /** Event handler called when the value changes. */
  onChange?: (value: T) => void;

  /** Whether the combobox allow multiple selection. */
  multiple?: false;

  /** The string representation of the selected option to display in the `Combobox.Input`.  */
  displayValue?: (option: T) => string;
}

export interface ComboboxMultipleSelectionOptions<T> {
  /** The controlled value of the combobox. */
  value?: T[];

  /**
   * The value of the combobox when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: T[];

  /** Event handler called when the value changes. */
  onChange?: (value: T[]) => void;

  /** Whether the combobox allow multiple selection. */
  multiple: true;

  displayValue?: never;
}

export type ComboboxRootOptions<Option, OptGroup = never> = (
  | ComboboxSingleSelectionOptions<Option>
  | ComboboxMultipleSelectionOptions<Option>
) &
  AsChildProp &
  Omit<
    ComboboxBaseOptions<Option, OptGroup>,
    "value" | "defaultValue" | "onChange" | "selectionMode" | "displayValue"
  >;

export type ComboboxRootProps<Option, OptGroup = never> = OverrideComponentProps<
  "div",
  ComboboxRootOptions<Option, OptGroup>
>;

/**
 * An  input widget with an associated popup that enables users to select a value from a collection of possible values.
 */
export function ComboboxRoot<Option, OptGroup = never>(props: ComboboxRootProps<Option, OptGroup>) {
  const [local, others] = splitProps(props, [
    "value",
    "defaultValue",
    "onChange",
    "multiple",
    "displayValue",
  ]);

  const value = createMemo(() => {
    if (local.value == null) {
      return undefined;
    }

    return local.multiple ? (local.value as Option[]) : [local.value as Option];
  });

  const defaultValue = createMemo(() => {
    if (local.defaultValue == null) {
      return undefined;
    }

    return local.multiple ? (local.defaultValue as Option[]) : [local.defaultValue as Option];
  });

  const onChange = (value: Option[]) => {
    local.onChange?.(local.multiple ? value : (value[0] as any));
  };

  const displayValue = (option: Option) => {
    return local.displayValue?.(option) ?? "";
  };

  return (
    <ComboboxBase
      value={value()}
      defaultValue={defaultValue()}
      onChange={onChange}
      selectionMode={local.multiple ? "multiple" : "single"}
      disallowEmptySelection={!local.multiple}
      displayValue={!local.multiple ? displayValue : undefined}
      {...others}
    />
  );
}
