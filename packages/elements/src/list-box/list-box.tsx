/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/listbox/src/useListBox.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";

import { createCollection, createControllableSetSignal } from "../primitives";
import { ListBoxContext, ListBoxContextValue, ListBoxDataSet } from "./list-box-context";
import { ListBoxOption } from "./list-box-option";
import { ListBoxOptionDescription } from "./list-box-option-description";
import { ListBoxOptionLabel } from "./list-box-option-label";
import { ListBoxItem, ListBoxSelectionMode } from "./types";

type ListBoxComposite = {
  Option: typeof ListBoxOption;
  OptionLabel: typeof ListBoxOptionLabel;
  OptionDescription: typeof ListBoxOptionDescription;
};

export interface ListBoxProps {
  /** The controlled value state of the listbox. */
  value?: Set<string>;

  /**
   * The default value state when initially rendered.
   * Useful when you do not need to control the value state.
   */
  defaultValue?: Set<string>;

  /**
   * Event handler called when the value state of the listbox changes.
   * Note: In "single" selection mode the Set will contain a single value at a time.
   */
  onValueChange?: (value: Set<string>) => void;

  /** The type of selection that is allowed in the collection. */
  selectionMode?: ListBoxSelectionMode;
}

/**
 * Listbox presents a list of options and allows a user to select one or more of them.
 * This component is based on the [WAI-ARIA Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
 */
export const ListBox = createPolymorphicComponent<"ul", ListBoxProps, ListBoxComposite>(props => {
  const defaultId = `kb-listbox-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "ul",
      id: defaultId,
      selectionMode: "single",
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "value",
    "defaultValue",
    "onValueChange",
    "selectionMode",
  ]);

  const [value, setValue] = createControllableSetSignal({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: value => local.onValueChange?.(value),
  });

  const [items, setItems] = createSignal<Array<ListBoxItem>>([]);

  const { CollectionProvider } = createCollection({
    items,
    onItemsChange: setItems,
  });

  const dataset: Accessor<ListBoxDataSet> = createMemo(() => ({}));

  const context: ListBoxContextValue = {
    dataset,
    selectionMode: () => local.selectionMode!,
    generateId: part => `${others.id!}-${part}`,
  };

  createEffect(() => {
    console.log(items().map(i => i.textValue()));
  });

  return (
    <CollectionProvider>
      <ListBoxContext.Provider value={context}>
        <Dynamic
          component={local.as}
          role="listbox"
          aria-multiselectable={local.selectionMode === "multiple" ? true : undefined}
          {...dataset()}
          {...others}
        />
      </ListBoxContext.Provider>
    </CollectionProvider>
  );
});

ListBox.Option = ListBoxOption;
ListBox.OptionLabel = ListBoxOptionLabel;
ListBox.OptionDescription = ListBoxOptionDescription;
