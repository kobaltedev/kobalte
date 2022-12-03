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
  mergeRefs,
} from "@kobalte/utils";
import { Accessor, createMemo, createUniqueId, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  createListState,
  CreateListStateProps,
  createSelectableList,
  CreateSelectableListProps,
} from "../list";
import { CollectionBase, CollectionNode } from "../primitives";
import { ForItems } from "../primitives/create-collection/for-items";
import { FocusStrategy, KeyboardDelegate, MultipleSelection } from "../selection";
import { ListBoxContext, ListBoxContextValue, ListBoxDataSet } from "./list-box-context";
import { ListBoxOption } from "./list-box-option";
import { ListBoxOptionDescription } from "./list-box-option-description";
import { ListBoxOptionLabel } from "./list-box-option-label";

type ListBoxComposite = {
  Option: typeof ListBoxOption;
  OptionLabel: typeof ListBoxOptionLabel;
  OptionDescription: typeof ListBoxOptionDescription;
};

export interface ListBoxProps<SectionSource, ItemSource>
  extends CollectionBase<SectionSource, ItemSource>,
    Pick<
      CreateListStateProps<SectionSource, ItemSource>,
      "allowDuplicateSelectionEvents" | "disabledBehavior" | "selectionBehavior" | "filter"
    >,
    Pick<
      CreateSelectableListProps<SectionSource | ItemSource>,
      "selectOnFocus" | "disallowTypeAhead" | "allowsTabNavigation"
    >,
    MultipleSelection {
  /** Whether to autofocus the listbox or an option. */
  autoFocus?: boolean | FocusStrategy;

  /** Whether focus should wrap around when the end/start is reached. */
  shouldFocusWrap?: boolean;

  /** Whether the listbox uses virtual scrolling. */
  isVirtualized?: boolean;

  /**
   * An optional keyboard delegate implementation for type to select,
   * to override the default.
   */
  keyboardDelegate?: KeyboardDelegate;

  /** Whether the listbox items should use virtual focus instead of being focused directly. */
  shouldUseVirtualFocus?: boolean;

  /** Whether selection should occur on press up instead of press down. */
  shouldSelectOnPressUp?: boolean;

  /** Whether options should be focused when the user hovers over them. */
  shouldFocusOnHover?: boolean;

  /**
   * Handler that is called when a user performs an action on an item. The exact user event depends on
   * the collection's `selectionBehavior` prop and the interaction modality.
   */
  onAction?: (key: string) => void;

  /** Render prop that receives an item and index signals and returns a JSX-Element. */
  children?: (
    item: Accessor<CollectionNode<SectionSource | ItemSource>>,
    index: Accessor<number>
  ) => JSX.Element;
}

/**
 * Listbox presents a list of options and allows a user to select one or more of them.
 * This component is based on the [WAI-ARIA Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
 */
export const ListBox = createPolymorphicComponent<"ul", ListBoxProps<any, any>, ListBoxComposite>(
  props => {
    let ref: HTMLUListElement | undefined;

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
      "ref",
      "children",
      "autoFocus",
      "shouldFocusWrap",
      "isVirtualized",
      "keyboardDelegate",
      "shouldUseVirtualFocus",
      "shouldSelectOnPressUp",
      "shouldFocusOnHover",
      "onAction",
      "allowDuplicateSelectionEvents",
      "defaultSelectedKeys",
      "disabledBehavior",
      "disabledKeys",
      "disallowEmptySelection",
      "selectedKeys",
      "selectionBehavior",
      "selectionMode",
      "selectOnFocus",
      "disallowTypeAhead",
      "allowsTabNavigation",
      "onAction",
      "dataSource",
      "onSelectionChange",
      "getItem",
      "getSection",
      "filter",
    ]);

    const listState = createListState({
      allowDuplicateSelectionEvents: () => access(local.allowDuplicateSelectionEvents),
      defaultSelectedKeys: () => access(local.defaultSelectedKeys),
      disabledBehavior: () => access(local.disabledBehavior),
      disabledKeys: () => access(local.disabledKeys),
      disallowEmptySelection: () => access(local.disallowEmptySelection),
      selectedKeys: () => access(local.selectedKeys),
      selectionBehavior: () => access(local.selectionBehavior),
      selectionMode: () => access(local.selectionMode),
      dataSource: () => access(local.dataSource),
      getItem: local.getItem,
      getSection: local.getSection,
      onSelectionChange: local.onSelectionChange,
      filter: local.filter,
    });

    const selectableList = createSelectableList(
      {
        selectionManager: listState.selectionManager,
        collection: listState.collection,
        disabledKeys: listState.disabledKeys,
        keyboardDelegate: () => local.keyboardDelegate,
        autoFocus: () => access(local.autoFocus),
        shouldFocusWrap: () => access(local.shouldFocusWrap),
        disallowEmptySelection: () => access(local.disallowEmptySelection),
        selectOnFocus: () => access(local.selectOnFocus),
        disallowTypeAhead: () => access(local.disallowTypeAhead),
        shouldUseVirtualFocus: () => access(local.shouldUseVirtualFocus),
        allowsTabNavigation: () => access(local.allowsTabNavigation),
        isVirtualized: () => access(local.isVirtualized),
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
      isVirtualized: () => props.isVirtualized,
      onAction: key => local.onAction?.(key),
    };

    return (
      <ListBoxContext.Provider value={context}>
        <Dynamic
          component={local.as}
          role="listbox"
          tabIndex={selectableList.tabIndex()}
          aria-multiselectable={
            listState.selectionManager().selectionMode() === "multiple" ? true : undefined
          }
          {...dataset()}
          {...combineProps(others, selectableList.handlers)}
          ref={mergeRefs(el => (ref = el), local.ref)}
        >
          <ForItems in={listState.collection()}>
            {(item, index) => local.children?.(item, index)}
          </ForItems>
        </Dynamic>
      </ListBoxContext.Provider>
    );
  }
);

ListBox.Option = ListBoxOption;
ListBox.OptionLabel = ListBoxOptionLabel;
ListBox.OptionDescription = ListBoxOptionDescription;
