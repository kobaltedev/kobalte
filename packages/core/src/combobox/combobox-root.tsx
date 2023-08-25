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
    if (local.value != null) {
      return local.multiple ? local.value : [local.value];
    }

    return local.value;
  });

  const defaultValue = createMemo(() => {
    if (local.defaultValue != null) {
      return local.multiple ? local.defaultValue : [local.defaultValue];
    }

    return local.defaultValue;
  });

  const onChange = (value: Option[]) => {
    if (local.multiple) {
      local.onChange?.(value as any);
    } else {
      // use `null` as "no value" because `undefined` mean the component is "uncontrolled".
      local.onChange?.((value[0] ?? null) as any);
    }
  };

  return (
    <ComboboxBase<Option, OptGroup>
      value={value() as any}
      defaultValue={defaultValue() as any}
      onChange={onChange}
      selectionMode={local.multiple ? "multiple" : "single"}
      {...others}
    />
  );
}
