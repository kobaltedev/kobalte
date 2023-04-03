import { OverrideComponentProps } from "@kobalte/utils";
import { Component, createMemo, splitProps } from "solid-js";

import { AsChildProp } from "../polymorphic";
import { CollectionNode } from "../primitives";
import {
  ComboboxBase,
  ComboboxBaseItemComponentProps,
  ComboboxBaseOptions,
  ComboboxBaseSectionComponentProps,
  ComboboxBaseValueComponentProps,
} from "./combobox-base";

export interface ComboboxValueComponentProps<T> {
  /** The selected item. */
  item: CollectionNode<T>;

  /** A function to clear the selection. */
  clear: () => void;
}

export interface ComboboxItemComponentProps<T> extends ComboboxBaseItemComponentProps<T> {}
export interface ComboboxSectionComponentProps<T> extends ComboboxBaseSectionComponentProps<T> {}

export interface ComboboxRootOptions<Option, OptGroup = never>
  extends Omit<
    ComboboxBaseOptions<Option, OptGroup>,
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

  /** The component to render inside `Combobox.Value`. */
  valueComponent?: Component<ComboboxValueComponentProps<Option>>;

  /** When NOT virtualized, the component to render as an item in the `Combobox.Listbox`. */
  itemComponent?: Component<ComboboxItemComponentProps<Option>>;

  /** When NOT virtualized, the component to render as a section in the `Combobox.Listbox`. */
  sectionComponent?: Component<ComboboxSectionComponentProps<OptGroup>>;
}

export interface ComboboxRootProps<Option, OptGroup = never>
  extends OverrideComponentProps<"div", ComboboxRootOptions<Option, OptGroup>>,
    AsChildProp {}

/**
 * Displays a list of options for the user to pick from — triggered by a button.
 */
export function ComboboxRoot<Option, OptGroup = never>(props: ComboboxRootProps<Option, OptGroup>) {
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

  const valueComponent = (props: ComboboxBaseValueComponentProps<Option>) => {
    return local.valueComponent?.({
      get item() {
        return props.items[0];
      },
      clear: () => props.clear(),
    });
  };

  return (
    <ComboboxBase
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
