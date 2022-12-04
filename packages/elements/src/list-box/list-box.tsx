/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useListBox.ts
 */

import {
  access,
  combineProps,
  createPolymorphicComponent,
  mergeDefaultProps,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  createListState,
  CreateListStateProps,
  createSelectableList,
  CreateSelectableListProps,
} from "../list";
import { createDomCollection } from "../primitives";
import { FocusStrategy, MultipleSelection, SelectionType } from "../selection";
import { ListBoxContext, ListBoxContextValue, ListBoxDataSet } from "./list-box-context";
import { ListBoxGroup } from "./list-box-group";
import { ListBoxGroupLabel } from "./list-box-group-label";
import { ListBoxGroupOptions } from "./list-box-group-options";
import { ListBoxOption } from "./list-box-option";
import { ListBoxOptionDescription } from "./list-box-option-description";
import { ListBoxOptionIndicator } from "./list-box-option-indicator";
import { ListBoxOptionLabel } from "./list-box-option-label";
import { ListBoxItem } from "./types";

type ListBoxComposite = {
  Group: typeof ListBoxGroup;
  GroupLabel: typeof ListBoxGroupLabel;
  GroupOptions: typeof ListBoxGroupOptions;
  Option: typeof ListBoxOption;
  OptionLabel: typeof ListBoxOptionLabel;
  OptionDescription: typeof ListBoxOptionDescription;
  OptionIndicator: typeof ListBoxOptionIndicator;
};

export interface ListBoxProps
  extends Pick<CreateListStateProps, "allowDuplicateSelectionEvents" | "selectionBehavior">,
    Pick<CreateSelectableListProps, "selectOnFocus" | "disallowTypeAhead" | "allowsTabNavigation">,
    Pick<MultipleSelection, "disallowEmptySelection" | "selectionMode"> {
  /** The controlled value of the listbox. */
  value?: "all" | Iterable<string>;

  /**
   * The value of the listbox when initially rendered.
   * Useful when you do not need to control the state.
   */
  defaultValue?: "all" | Iterable<string>;

  /** Event handler called when the value changes. */
  onValueChange?: (value: SelectionType) => void;

  /** Whether to autofocus the listbox or an option. */
  autoFocus?: boolean | FocusStrategy;

  /** Whether focus should wrap around when the end/start is reached. */
  shouldFocusWrap?: boolean;

  /** Whether the listbox items should use virtual focus instead of being focused directly. */
  shouldUseVirtualFocus?: boolean;

  /** Whether selection should occur on press up instead of press down. */
  shouldSelectOnPressUp?: boolean;

  /** Whether options should be focused when the user hovers over them. */
  shouldFocusOnHover?: boolean;
}

/**
 * Listbox presents a list of options and allows a user to select one or more of them.
 * This component is based on the [WAI-ARIA Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
 */
export const ListBox = createPolymorphicComponent<"ul", ListBoxProps, ListBoxComposite>(props => {
  let ref: HTMLUListElement | undefined;

  const defaultId = `listbox-${createUniqueId()}`;

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
    "autoFocus",
    "shouldFocusWrap",
    "shouldUseVirtualFocus",
    "shouldSelectOnPressUp",
    "shouldFocusOnHover",
    "allowDuplicateSelectionEvents",
    "disallowEmptySelection",
    "selectionBehavior",
    "selectionMode",
    "selectOnFocus",
    "disallowTypeAhead",
    "allowsTabNavigation",
  ]);

  const [items, setItems] = createSignal<Array<ListBoxItem>>([]);

  const { DomCollectionProvider } = createDomCollection({
    items,
    onItemsChange: setItems,
  });

  const listState = createListState({
    selectedKeys: () => local.value,
    defaultSelectedKeys: () => local.defaultValue,
    onSelectionChange: local.onValueChange,
    allowDuplicateSelectionEvents: () => access(local.allowDuplicateSelectionEvents),
    disallowEmptySelection: () => access(local.disallowEmptySelection),
    selectionBehavior: () => access(local.selectionBehavior),
    selectionMode: () => access(local.selectionMode),
    dataSource: items,
    getNode: (source: ListBoxItem) => ({
      key: source.value,
      textValue: source.textValue,
      isDisabled: source.isDisabled,
    }),
  });

  const selectableList = createSelectableList(
    {
      selectionManager: listState.selectionManager,
      collection: listState.collection,
      autoFocus: () => access(local.autoFocus),
      shouldFocusWrap: () => access(local.shouldFocusWrap),
      disallowEmptySelection: () => access(local.disallowEmptySelection),
      selectOnFocus: () => access(local.selectOnFocus),
      disallowTypeAhead: () => access(local.disallowTypeAhead),
      shouldUseVirtualFocus: () => access(local.shouldUseVirtualFocus),
      allowsTabNavigation: () => access(local.allowsTabNavigation),
      isVirtualized: false,
    },
    () => ref
  );

  const dataset: Accessor<ListBoxDataSet> = createMemo(() => ({}));

  const context: ListBoxContextValue = {
    dataset,
    listState: () => listState,
    generateId: part => `${others.id!}-${part}`,
    shouldUseVirtualFocus: () => props.shouldUseVirtualFocus,
    shouldSelectOnPressUp: () => props.shouldSelectOnPressUp,
    shouldFocusOnHover: () => props.shouldFocusOnHover,
    isVirtualized: () => false,
  };

  return (
    <DomCollectionProvider>
      <ListBoxContext.Provider value={context}>
        <Dynamic
          component={local.as}
          role="listbox"
          tabIndex={selectableList.tabIndex()}
          aria-multiselectable={
            listState.selectionManager().selectionMode() === "multiple" ? true : undefined
          }
          {...dataset()}
          {...combineProps({ ref: el => (ref = el) }, others, selectableList.handlers)}
        />
      </ListBoxContext.Provider>
    </DomCollectionProvider>
  );
});

ListBox.Group = ListBoxGroup;
ListBox.GroupLabel = ListBoxGroupLabel;
ListBox.GroupOptions = ListBoxGroupOptions;
ListBox.Option = ListBoxOption;
ListBox.OptionLabel = ListBoxOptionLabel;
ListBox.OptionDescription = ListBoxOptionDescription;
ListBox.OptionIndicator = ListBoxOptionIndicator;
