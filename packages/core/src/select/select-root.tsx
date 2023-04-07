import { OverrideComponentProps } from "@kobalte/utils";
import { Component, createMemo, splitProps } from "solid-js";

import { AsChildProp } from "../polymorphic";
import { CollectionNode } from "../primitives";
import {
  SelectBase,
  SelectBaseItemComponentProps,
  SelectBaseOptions,
  SelectBaseSectionComponentProps,
  SelectBaseValueComponentProps,
} from "./select-base";

export interface SelectValueComponentProps<T> {
  /** The selected item. */
  item: CollectionNode<T>;

  /** A function to clear the selection. */
  clear: () => void;
}

export interface SelectItemComponentProps<T> extends SelectBaseItemComponentProps<T> {}
export interface SelectSectionComponentProps<T> extends SelectBaseSectionComponentProps<T> {}

export interface SelectRootOptions<Option, OptGroup = never>
  extends Omit<
    SelectBaseOptions<Option, OptGroup>,
    | "valueComponent"
    | "itemComponent"
    | "sectionComponent"
    | "value"
    | "defaultValue"
    | "onChange"
    | "selectionMode"
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

  /** The component to render inside `Select.Value`. */
  valueComponent?: Component<SelectValueComponentProps<Option>>;

  /** When NOT virtualized, the component to render as an item in the `Select.Listbox`. */
  itemComponent?: Component<SelectItemComponentProps<Option>>;

  /** When NOT virtualized, the component to render as a section in the `Select.Listbox`. */
  sectionComponent?: Component<SelectSectionComponentProps<OptGroup>>;
}

export interface SelectRootProps<Option, OptGroup = never>
  extends OverrideComponentProps<"div", SelectRootOptions<Option, OptGroup>>,
    AsChildProp {}

/**
 * Displays a list of options for the user to pick from — triggered by a button.
 */
export function SelectRoot<Option, OptGroup = never>(props: SelectRootProps<Option, OptGroup>) {
  const [local, others] = splitProps(props, [
    "valueComponent",
    "value",
    "defaultValue",
    "onChange",
  ]);

  const value = createMemo(() => {
    return local.value != null ? new Set([local.value]) : undefined;
  });

  const defaultValue = createMemo(() => {
    return local.defaultValue != null ? new Set([local.defaultValue]) : undefined;
  });

  const onChange = (value: Set<string>) => {
    local.onChange?.(value.values().next().value);
  };

  const valueComponent = (props: SelectBaseValueComponentProps<Option>) => {
    return local.valueComponent?.({
      get item() {
        return props.items[0];
      },
      clear: () => props.clear(),
    });
  };

  return (
    <SelectBase
      value={value()}
      defaultValue={defaultValue()}
      onChange={onChange}
      selectionMode="single"
      disallowEmptySelection
      valueComponent={valueComponent}
      {...others}
    />
  );
}
