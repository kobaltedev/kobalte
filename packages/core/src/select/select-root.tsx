import { ParentProps, splitProps } from "solid-js";

import { createControllableSetSignal } from "../primitives";
import { SelectBase, SelectBaseOptions } from "./select-base";

export interface SelectRootOptions
  extends Omit<SelectBaseOptions, "value" | "defaultValue" | "onValueChange" | "selectionMode"> {
  /** The controlled value of the select. */
  value?: string;

  /**
   * The value of the select when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: string;

  /** Event handler called when the value changes. */
  onValueChange?: (value: string) => void;
}

/**
 * Displays a list of options for the user to pick from — triggered by a button.
 */
export function SelectRoot(props: ParentProps<SelectRootOptions>) {
  const [local, others] = splitProps(props, ["value", "defaultValue", "onValueChange"]);

  const [value, setValue] = createControllableSetSignal({
    value: () => (local.value != null ? new Set([local.value]) : undefined),
    defaultValue: () => (local.defaultValue != null ? new Set([local.defaultValue]) : undefined),
    onChange: value => local.onValueChange?.(value.values().next().value),
  });

  return (
    <SelectBase
      value={value()}
      onValueChange={setValue}
      selectionMode="single"
      disallowEmptySelection
      {...others}
    />
  );
}
