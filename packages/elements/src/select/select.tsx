import { access, callHandler, mergeDefaultProps } from "@kobalte/utils";
import {
  createMemo,
  createSignal,
  createUniqueId,
  JSX,
  ParentComponent,
  splitProps,
} from "solid-js";

import { createListState, CreateListStateProps, ListKeyboardDelegate } from "../list";
import { SelectContext, SelectContextValue } from "./select-context";
import { CollectionKey, createDisclosure } from "../primitives";
import { createTypeSelect, FocusStrategy, KeyboardDelegate, SelectionType } from "../selection";
import { ListboxOptionGroupPropertyNames, ListboxOptionPropertyNames } from "../listbox";
import { createCollator } from "../i18n";
import { SelectTrigger } from "./select-trigger";
import { SelectMenu } from "./select-menu";

type SelectComposite = {
  Trigger: typeof SelectTrigger;
  Menu: typeof SelectMenu;
};

export interface SelectProps
  extends Pick<
    CreateListStateProps,
    | "filter"
    | "allowDuplicateSelectionEvents"
    | "disallowEmptySelection"
    | "selectionBehavior"
    | "selectionMode"
  > {
  /** The controlled open state of the select. */
  isOpen?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultIsOpen?: boolean;

  /** Event handler called when the open state of the select changes. */
  onOpenChange?: (isOpen: boolean) => void;

  /** The controlled value of the select. */
  value?: "all" | Iterable<CollectionKey>;

  /**
   * The value of the select when initially rendered.
   * Useful when you do not need to control the state.
   */
  defaultValue?: "all" | Iterable<CollectionKey>;

  /** Event handler called when the value changes. */
  onValueChange?: (value: SelectionType) => void;

  /** An array of objects to display as the available options. */
  options: Array<any>;

  /**
   * When using custom object as select options,
   * property names used to map an object to a select option.
   */
  optionPropertyNames?: ListboxOptionPropertyNames;

  /**
   * When using custom object as select option groups,
   * property names used to map an object to a select option group.
   */
  optionGroupPropertyNames?: ListboxOptionGroupPropertyNames;

  /** An optional keyboard delegate implementation for type to select, to override the default. */
  keyboardDelegate?: KeyboardDelegate;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /** Whether the select is disabled. */
  isDisabled?: boolean;

  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export const Select: ParentComponent<SelectProps> & SelectComposite = props => {
  const defaultId = `select-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      selectionMode: "single",
    },
    props
  );

  const [local, others] = splitProps(props, [
    "children",
    "id",
    "isOpen",
    "defaultIsOpen",
    "onOpenChange",
    "value",
    "defaultValue",
    "options",
    "onValueChange",
    "optionPropertyNames",
    "optionGroupPropertyNames",
    "keyboardDelegate",
    "isDisabled",
    "allowDuplicateSelectionEvents",
    "disallowEmptySelection",
    "selectionBehavior",
    "selectionMode",
    "filter",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
  ]);

  const [listboxId, setListboxId] = createSignal<string>();
  const [triggerId, setTriggerId] = createSignal<string>();

  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy>();
  const [isFocused, setIsFocused] = createSignal(false);

  const isSingleSelect = () => access(local.selectionMode) === "single";

  const disclosureState = createDisclosure({
    isOpen: () => local.isOpen,
    defaultIsOpen: () => local.defaultIsOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const listState = createListState({
    selectedKeys: () => local.value,
    defaultSelectedKeys: () => local.defaultValue,
    onSelectionChange: keys => {
      local.onValueChange?.(keys);

      if (isSingleSelect()) {
        disclosureState.close();
      }
    },
    allowDuplicateSelectionEvents: () => access(local.allowDuplicateSelectionEvents),
    disallowEmptySelection: () => access(local.disallowEmptySelection),
    selectionBehavior: () => access(local.selectionBehavior),
    selectionMode: () => access(local.selectionMode),
    dataSource: () => local.options,
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

  const isCollectionEmpty = () => listState.collection().getSize() <= 0;

  const open = (focusStrategy?: FocusStrategy) => {
    // Don't open if the collection is empty.
    if (isCollectionEmpty()) {
      return;
    }

    setFocusStrategy(focusStrategy);
    disclosureState.open();
  };

  const toggle = (focusStrategy?: FocusStrategy) => {
    if (isCollectionEmpty()) {
      return;
    }

    setFocusStrategy(focusStrategy);
    disclosureState.toggle();
  };

  // START - useSelect
  const collator = createCollator({ usage: "search", sensitivity: "base" });

  // By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
  // When virtualized, the layout object will be passed in as a prop and override this.
  const delegate = createMemo(() => {
    const keyboardDelegate = access(local.keyboardDelegate);

    if (keyboardDelegate) {
      return keyboardDelegate;
    }

    return new ListKeyboardDelegate(listState.collection, undefined, collator);
  });

  const { typeSelectHandlers } = createTypeSelect({
    keyboardDelegate: delegate,
    selectionManager: () => listState.selectionManager(),
    onTypeSelect: key => listState.selectionManager().select(key),
  });

  const onTriggerKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = e => {
    if (local.isDisabled) {
      return;
    }

    callHandler(e, typeSelectHandlers.onKeyDown);

    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.stopPropagation();
        e.preventDefault();
        context.toggle("first");
        break;
      case "ArrowUp":
        e.stopPropagation();
        e.preventDefault();
        context.toggle("last");
        break;
      case "ArrowLeft": {
        // prevent scrolling containers
        e.preventDefault();

        if (!isSingleSelect()) {
          return;
        }

        const firstSelectedKey = listState.selectionManager().firstSelectedKey();

        const key =
          firstSelectedKey != null
            ? delegate().getKeyAbove?.(firstSelectedKey)
            : delegate().getFirstKey?.();

        if (key) {
          listState.selectionManager().select(key);
        }

        break;
      }
      case "ArrowRight": {
        // prevent scrolling containers
        e.preventDefault();

        if (!isSingleSelect()) {
          return;
        }

        const firstSelectedKey = listState.selectionManager().firstSelectedKey();

        const key =
          firstSelectedKey != null
            ? delegate().getKeyBelow?.(firstSelectedKey)
            : delegate().getFirstKey?.();

        if (key) {
          listState.selectionManager().select(key);
        }

        break;
      }
    }
  };

  // TODO: handle label, description and errorMessage aria-*

  const onTriggerFocus: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    if (isFocused()) {
      return;
    }

    setIsFocused(true);
  };

  const onTriggerBlur: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    if (disclosureState.isOpen()) {
      return;
    }

    setIsFocused(false);
  };

  const onListboxFocusOut = () => {
    setIsFocused(false);
  };

  // END - useSelect

  const context: SelectContextValue = {
    isOpen: () => disclosureState.isOpen(),
    isDisabled: () => local.isDisabled ?? false,
    autoFocus: () => focusStrategy() || true,
    listState: () => listState,
    listboxId,
    triggerId,
    toggle,
    generateId: part => `${local.id!}-${part}`,
    onTriggerKeyDown,
    onTriggerFocus,
    onTriggerBlur,
    onListboxFocusOut,
    registerTrigger: id => {
      setTriggerId(id);
      return () => setTriggerId(undefined);
    },
    registerListbox: id => {
      setListboxId(id);
      return () => setListboxId(undefined);
    },
  };

  return <SelectContext.Provider value={context}>{props.children}</SelectContext.Provider>;
};

Select.Trigger = SelectTrigger;
Select.Menu = SelectMenu;

/*

<Select options={options()}>
  <div>
    <Select.Label />
    <Select.Trigger>
      <Select.Value />
      <Select.Icon />
    </Select.Trigger>
    <Select.Description />
    <Select.ErrorMessage />
  </div>
  <Select.Portal>
    <Select.Positioner>
      <Select.Panel>
        <Select.Menu>
          {node => (
            <Select.Option node={node()}>
              <Select.OptionLabel>
                {node().label}
              </Select.OptionLabel>
              <Select.OptionIndicator>
                ✅
              </Select.OptionIndicator>
            </Select.Option>
          )}
        </Select.Menu>
      </Select.Panel>
    </Select.Positioner>
  </Select.Portal>
</Select>

*/
