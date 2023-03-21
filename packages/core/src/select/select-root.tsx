import { Accessor, JSX, splitProps } from "solid-js";

import { CollectionNode, createControllableSetSignal } from "../primitives";
import { MultiSelectionState, SelectBase, SelectBaseOptions } from "./select-base";

export interface SingleSelectionState<T> {
  /** The selected item. */
  item: Accessor<CollectionNode<T>>;

  /** A function to clear the selection. */
  clear: () => void;
}

export interface SelectRootOptions<Option, OptGroup = never>
  extends Omit<
    SelectBaseOptions<Option, OptGroup>,
    "value" | "defaultValue" | "onValueChange" | "renderValue" | "selectionMode"
  > {
  /** The controlled value of the select. */
  value?: string;

  /**
   * The value of the select when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: string;

  /** Event handler called when the value changes. */
  onValueChange?: (value: string) => void;

  /** A map function that receives the selection state. */
  renderValue?: (selection: SingleSelectionState<Option>) => JSX.Element;
}

export interface SelectRootProps<Option, OptGroup = never>
  extends SelectRootOptions<Option, OptGroup> {}

/**
 * Displays a list of options for the user to pick from — triggered by a button.
 */
export function SelectRoot<Option, OptGroup = never>(props: SelectRootProps<Option, OptGroup>) {
  const [local, others] = splitProps(props, [
    "value",
    "defaultValue",
    "onValueChange",
    "renderValue",
  ]);

  const [value, setValue] = createControllableSetSignal({
    value: () => (local.value != null ? new Set([local.value]) : undefined),
    defaultValue: () => (local.defaultValue != null ? new Set([local.defaultValue]) : undefined),
    onChange: value => local.onValueChange?.(value.values().next().value),
  });

  const renderValue = (selection: MultiSelectionState<Option>) => {
    return local.renderValue?.({
      item: () => selection.items()[0],
      clear: () => selection.clear(),
    });
  };

  return (
    <SelectBase
      value={value()}
      onValueChange={setValue}
      selectionMode="single"
      disallowEmptySelection
      renderValue={renderValue}
      {...others}
    />
  );
}
