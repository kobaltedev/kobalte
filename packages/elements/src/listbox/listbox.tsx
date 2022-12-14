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
  Key,
  mergeDefaultProps,
} from "@kobalte/utils";
import { Accessor, createMemo, createUniqueId, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  createListState,
  CreateListStateProps,
  createSelectableList,
  CreateSelectableListProps,
  ListState,
} from "../list";
import { CollectionKey, CollectionNode, createFocusRing } from "../primitives";
import { FocusStrategy, KeyboardDelegate, SelectionType } from "../selection";
import { ListboxContext, ListboxContextValue } from "./listbox-context";
import { ListboxGroup } from "./listbox-group";
import { ListboxGroupLabel } from "./listbox-group-label";
import { ListboxGroupOptions } from "./listbox-group-options";
import { ListboxOption } from "./listbox-option";
import { ListboxOptionDescription } from "./listbox-option-description";
import { ListboxOptionIndicator } from "./listbox-option-indicator";
import { ListboxOptionLabel } from "./listbox-option-label";

type ListboxComposite = {
  Group: typeof ListboxGroup;
  GroupLabel: typeof ListboxGroupLabel;
  GroupOptions: typeof ListboxGroupOptions;
  Option: typeof ListboxOption;
  OptionLabel: typeof ListboxOptionLabel;
  OptionDescription: typeof ListboxOptionDescription;
  OptionIndicator: typeof ListboxOptionIndicator;
};

export interface ListboxOptionPropertyNames {
  /** Property name that refers to the value of an option. */
  value?: string;

  /** Property name that refers to the label of an option. */
  label?: string;

  /** Property name that refers to the text value of an option, used for features like typeahead. */
  textValue?: string;

  /** Property name to use as the disabled flag of an option. */
  disabled?: string;
}

export interface ListboxOptionGroupPropertyNames {
  /** Property name that refers to the unique id of an option group. */
  id?: string;

  /** Property name that refers to the label of an option group. */
  label?: string;

  /** Property name that refers to the children options of an option group. */
  options?: string;
}

export interface ListboxProps
  extends Pick<
      CreateListStateProps,
      "filter" | "allowDuplicateSelectionEvents" | "disallowEmptySelection" | "selectionBehavior"
    >,
    Pick<CreateSelectableListProps, "selectOnFocus" | "disallowTypeAhead" | "allowsTabNavigation"> {
  /** The controlled value of the listbox. */
  value?: "all" | Iterable<CollectionKey>;

  /**
   * The value of the listbox when initially rendered.
   * Useful when you do not need to control the state.
   */
  defaultValue?: "all" | Iterable<CollectionKey>;

  /** Event handler called when the value changes. */
  onValueChange?: (value: SelectionType) => void;

  /** Whether the listbox allow multi-selection. */
  isMultiple?: boolean;

  /** A controlled state for the listbox. */
  state?: ListState;

  /** An array of objects to display as the available options. */
  options?: Array<any>;

  /**
   * When using custom object as listbox options, property names used to map an object to a listbox option.
   * @default { value: "value", label: "label", textValue: "textValue", disabled: "disabled" }
   * @example
   * const options = [{
   *  id: "1",
   *  name: "foo"
   * }];
   *
   * <Listbox
   *   options={options}
   *   optionPropertyNames={{
   *     value: "id",
   *     label: "name",
   *     textValue: "name",
   *   }}
   * />
   */
  optionPropertyNames?: ListboxOptionPropertyNames;

  /**
   * When using custom object as listbox option groups, property names used to map an object to a listbox option group.
   * @default { id: "id", label: "label", options: "options" }
   * @example
   * const groupedOptions = [{
   *   code: "1",
   *   name: "foo",
   *   items: [{
   *     id: "2",
   *     name: "bar
   *   }]
   * }];
   *
   * <Listbox
   *   options={groupedOptions}
   *   optionGroupPropertyNames={{
   *     id: "code",
   *     label: "name",
   *     options: "items"
   *   }}
   * />
   */
  optionGroupPropertyNames?: ListboxOptionGroupPropertyNames;

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

  /** Whether the listbox uses virtual scrolling. */
  isVirtualized?: boolean;

  /**
   * A map function that receives a _collection node_ signal representing a listbox option,
   * and an index signal and returns a JSX-Element.
   */
  children: (node: Accessor<CollectionNode>, index: Accessor<number>) => JSX.Element;

  /** The fallback content to render when there is no option/option group. */
  fallback?: JSX.Element;
}

/**
 * Listbox presents a list of options and allows a user to select one or more of them.
 * This component is based on the [WAI-ARIA Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
 */
export const Listbox = createPolymorphicComponent<"ul", ListboxProps, ListboxComposite>(props => {
  let ref: HTMLUListElement | undefined;

  const defaultId = `listbox-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "ul",
      id: defaultId,
      isMultiple: false,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "children",
    "fallback",
    "value",
    "defaultValue",
    "isMultiple",
    "state",
    "options",
    "onValueChange",
    "optionPropertyNames",
    "optionGroupPropertyNames",
    "keyboardDelegate",
    "autoFocus",
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
    "filter",
    "isVirtualized",
  ]);

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
      selectionMode: () => (local.isMultiple ? "multiple" : "single"),
      dataSource: () => local.options ?? [],
      itemPropertyNames: () => ({
        key: local.optionPropertyNames?.value ?? "value",
        label: local.optionPropertyNames?.label ?? "label",
        textValue: local.optionPropertyNames?.textValue ?? "textValue",
        disabled: local.optionPropertyNames?.disabled ?? "disabled",
      }),
      sectionPropertyNames: () => ({
        key: local.optionGroupPropertyNames?.id ?? "id",
        label: local.optionGroupPropertyNames?.label ?? "label",
        items: local.optionGroupPropertyNames?.options ?? "options",
      }),
      filter: local.filter,
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
      isVirtualized: () => local.isVirtualized,
    },
    () => ref
  );

  const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing({
    within: true,
  });

  const context: ListboxContextValue = {
    listState,
    generateId: part => `${others.id!}-${part}`,
    shouldUseVirtualFocus: () => props.shouldUseVirtualFocus,
    shouldSelectOnPressUp: () => props.shouldSelectOnPressUp,
    shouldFocusOnHover: () => props.shouldFocusOnHover,
    isVirtualized: () => local.isVirtualized,
  };

  return (
    <ListboxContext.Provider value={context}>
      <Dynamic
        component={local.as}
        role="listbox"
        tabIndex={selectableList.tabIndex()}
        aria-multiselectable={
          listState().selectionManager().selectionMode() === "multiple" ? true : undefined
        }
        data-focus={isFocused() ? "" : undefined}
        data-focus-visible={isFocusVisible() ? "" : undefined}
        {...combineProps(
          { ref: el => (ref = el) },
          others,
          selectableList.handlers,
          focusRingHandlers
        )}
      >
        <Key each={[...listState().collection()]} by="key" fallback={local.fallback}>
          {local.children}
        </Key>
      </Dynamic>
    </ListboxContext.Provider>
  );
});

Listbox.Group = ListboxGroup;
Listbox.GroupLabel = ListboxGroupLabel;
Listbox.GroupOptions = ListboxGroupOptions;
Listbox.Option = ListboxOption;
Listbox.OptionLabel = ListboxOptionLabel;
Listbox.OptionDescription = ListboxOptionDescription;
Listbox.OptionIndicator = ListboxOptionIndicator;
