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
import { createMemo, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  createListState,
  CreateListStateProps,
  createSelectableList,
  CreateSelectableListProps,
  ListState,
} from "../list";
import { CollectionItem, createControllableArraySignal } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { FocusStrategy, KeyboardDelegate } from "../selection";
import { ListboxContext, ListboxContextValue } from "./listbox-context";
import { ListboxGroup } from "./listbox-group";
import { ListboxGroupLabel } from "./listbox-group-label";
import { ListboxItem } from "./listbox-item";
import { ListboxItemDescription } from "./listbox-item-description";
import { ListboxItemIndicator } from "./listbox-item-indicator";
import { ListboxItemLabel } from "./listbox-item-label";

type ListboxComposite = {
  Group: typeof ListboxGroup;
  GroupLabel: typeof ListboxGroupLabel;
  Item: typeof ListboxItem;
  ItemLabel: typeof ListboxItemLabel;
  ItemDescription: typeof ListboxItemDescription;
  ItemIndicator: typeof ListboxItemIndicator;
};

export interface ListboxProps
  extends Pick<
      CreateListStateProps,
      | "allowDuplicateSelectionEvents"
      | "disallowEmptySelection"
      | "selectionBehavior"
      | "selectionMode"
    >,
    Pick<CreateSelectableListProps, "selectOnFocus" | "disallowTypeAhead" | "allowsTabNavigation"> {
  /** The controlled value of the listbox. */
  value?: Iterable<string>;

  /**
   * The value of the listbox when initially rendered.
   * Useful when you do not need to control the state.
   */
  defaultValue?: Iterable<string>;

  /** Event handler called when the value changes. */
  onValueChange?: (value: Set<string>) => void;

  /** The controlled items of the listbox. */
  items?: CollectionItem[];

  /** Event handler called when the items change. */
  onItemsChange?: (items: CollectionItem[]) => void;

  /** The controlled state of the listbox. */
  state?: ListState;

  /** An optional keyboard delegate implementation for type to select, to override the default. */
  keyboardDelegate?: KeyboardDelegate;

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
export const Listbox = createPolymorphicComponent<"div", ListboxProps, ListboxComposite>(props => {
  let ref: HTMLElement | undefined;

  const defaultId = `listbox-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
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
    "items",
    "onItemsChange",
    "state",
    "keyboardDelegate",
    "autoFocus",
    "selectionMode",
    "shouldFocusWrap",
    "shouldUseVirtualFocus",
    "shouldSelectOnPressUp",
    "shouldFocusOnHover",
    "allowDuplicateSelectionEvents",
    "disallowEmptySelection",
    "selectionBehavior",
    "selectOnFocus",
    "disallowTypeAhead",
    "allowsTabNavigation",
  ]);

  const [items, setItems] = createControllableArraySignal<CollectionItem>({
    value: () => local.items,
    defaultValue: () => [],
    onChange: value => local.onItemsChange?.(value),
  });

  const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });

  const listState = createMemo(() => {
    if (local.state) {
      return local.state;
    }

    return createListState({
      selectedKeys: () => local.value,
      defaultSelectedKeys: () => local.defaultValue,
      onSelectionChange: local.onValueChange,
      allowDuplicateSelectionEvents: () => access(local.allowDuplicateSelectionEvents),
      disallowEmptySelection: () => access(local.disallowEmptySelection),
      selectionBehavior: () => access(local.selectionBehavior),
      selectionMode: () => access(local.selectionMode),
      dataSource: items,
    });
  });

  const selectableList = createSelectableList(
    {
      selectionManager: () => listState().selectionManager(),
      collection: () => listState().collection(),
      autoFocus: () => access(local.autoFocus),
      shouldFocusWrap: () => access(local.shouldFocusWrap),
      keyboardDelegate: () => local.keyboardDelegate,
      disallowEmptySelection: () => access(local.disallowEmptySelection),
      selectOnFocus: () => access(local.selectOnFocus),
      disallowTypeAhead: () => access(local.disallowTypeAhead),
      shouldUseVirtualFocus: () => access(local.shouldUseVirtualFocus),
      allowsTabNavigation: () => access(local.allowsTabNavigation),
      isVirtualized: false,
    },
    () => ref
  );

  const context: ListboxContextValue = {
    listState,
    generateId: part => `${others.id!}-${part}`,
    shouldUseVirtualFocus: () => props.shouldUseVirtualFocus,
    shouldSelectOnPressUp: () => props.shouldSelectOnPressUp,
    shouldFocusOnHover: () => props.shouldFocusOnHover,
  };

  return (
    <DomCollectionProvider>
      <ListboxContext.Provider value={context}>
        <Dynamic
          component={local.as}
          role="listbox"
          tabIndex={selectableList.tabIndex()}
          aria-multiselectable={
            listState().selectionManager().selectionMode() === "multiple" ? true : undefined
          }
          data-focus={listState().selectionManager().isFocused() ? "" : undefined}
          {...combineProps({ ref: el => (ref = el) }, others, selectableList.handlers)}
        />
      </ListboxContext.Provider>{" "}
    </DomCollectionProvider>
  );
});

Listbox.Group = ListboxGroup;
Listbox.GroupLabel = ListboxGroupLabel;
Listbox.Item = ListboxItem;
Listbox.ItemLabel = ListboxItemLabel;
Listbox.ItemDescription = ListboxItemDescription;
Listbox.ItemIndicator = ListboxItemIndicator;
