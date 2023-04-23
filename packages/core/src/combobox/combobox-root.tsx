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
}

export type ComboboxRootOptions<Option, OptGroup = never> = (
  | ComboboxSingleSelectionOptions<Option>
  | ComboboxMultipleSelectionOptions<Option>
) &
  AsChildProp &
  Omit<
    ComboboxBaseOptions<Option, OptGroup>,
    "value" | "defaultValue" | "onChange" | "selectionMode"
  >;

export type ComboboxRootProps<Option, OptGroup = never> = OverrideComponentProps<
  "div",
  ComboboxRootOptions<Option, OptGroup>
>;

/**
 * A combo box combines a text input with a listbox, allowing users to filter a list of options to items matching a query.
 */
export function ComboboxRoot<Option, OptGroup = never>(props: ComboboxRootProps<Option, OptGroup>) {
  const [local, others] = splitProps(props, ["value", "defaultValue", "onChange", "multiple"]);

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

  return (
    <ComboboxBase
      value={value()}
      defaultValue={defaultValue()}
      onChange={onChange}
      selectionMode={local.multiple ? "multiple" : "single"}
      disallowEmptySelection={!local.multiple}
      {...others}
    />
  );
}
