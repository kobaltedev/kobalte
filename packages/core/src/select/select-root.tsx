import { OverrideComponentProps } from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";

import { AsChildProp } from "../polymorphic";
import { SelectBase, SelectBaseOptions } from "./select-base";

export interface SelectSingleSelectionOptions<T> {
  /** The controlled value of the select. */
  value?: T;

  /**
   * The value of the select when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: T;

  /** Event handler called when the value changes. */
  onChange?: (value: T) => void;

  /** Whether the select allow multiple selection. */
  multiple?: false;
}

export interface SelectMultipleSelectionOptions<T> {
  /** The controlled value of the select. */
  value?: T[];

  /**
   * The value of the select when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: T[];

  /** Event handler called when the value changes. */
  onChange?: (value: T[]) => void;

  /** Whether the select allow multiple selection. */
  multiple: true;
}

export type SelectRootOptions<Option, OptGroup = never> = (
  | SelectSingleSelectionOptions<Option>
  | SelectMultipleSelectionOptions<Option>
) &
  AsChildProp &
  Omit<
    SelectBaseOptions<Option, OptGroup>,
    "value" | "defaultValue" | "onChange" | "selectionMode"
  >;

export type SelectRootProps<Option, OptGroup = never> = OverrideComponentProps<
  "div",
  SelectRootOptions<Option, OptGroup>
>;

/**
 * Displays a list of options for the user to pick from — triggered by a button.
 */
export function SelectRoot<Option, OptGroup = never>(props: SelectRootProps<Option, OptGroup>) {
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
    <SelectBase
      value={value()}
      defaultValue={defaultValue()}
      onChange={onChange}
      selectionMode={local.multiple ? "multiple" : "single"}
      disallowEmptySelection={!local.multiple}
      {...others}
    />
  );
}
