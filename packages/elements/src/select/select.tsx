import { access, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import { DialogPortal } from "../dialog/dialog-portal";
import { createCollator } from "../i18n";
import { createListState, CreateListStateProps, ListKeyboardDelegate } from "../list";
import { ListboxOptionGroupPropertyNames, ListboxOptionPropertyNames } from "../listbox";
import { ListboxGroup } from "../listbox/listbox-group";
import { ListboxGroupLabel } from "../listbox/listbox-group-label";
import { ListboxGroupOptions } from "../listbox/listbox-group-options";
import { ListboxOption } from "../listbox/listbox-option";
import { ListboxOptionDescription } from "../listbox/listbox-option-description";
import { ListboxOptionIndicator } from "../listbox/listbox-option-indicator";
import { ListboxOptionLabel } from "../listbox/listbox-option-label";
import { Popover, PopoverFloatingProps } from "../popover";
import { PopoverArrow } from "../popover/popover-arrow";
import { PopoverPositioner } from "../popover/popover-positioner";
import { CollectionKey, createDisclosure } from "../primitives";
import { FocusStrategy, KeyboardDelegate, SelectionType } from "../selection";
import { SelectContext, SelectContextValue } from "./select-context";
import { SelectMenu } from "./select-menu";
import { SelectTrigger } from "./select-trigger";
import { SelectValue } from "./select-value";
import { SelectPanel } from "./select-panel";
import { SelectIcon } from "./select-icon";

type SelectComposite = {
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Icon: typeof SelectIcon;
  Panel: typeof SelectPanel;
  Menu: typeof SelectMenu;

  Positioner: typeof PopoverPositioner;
  Arrow: typeof PopoverArrow;

  Portal: typeof DialogPortal;

  Group: typeof ListboxGroup;
  GroupLabel: typeof ListboxGroupLabel;
  GroupOptions: typeof ListboxGroupOptions;
  Option: typeof ListboxOption;
  OptionLabel: typeof ListboxOptionLabel;
  OptionDescription: typeof ListboxOptionDescription;
  OptionIndicator: typeof ListboxOptionIndicator;
};

export interface SelectProps
  extends Pick<
      CreateListStateProps,
      | "filter"
      | "allowDuplicateSelectionEvents"
      | "disallowEmptySelection"
      | "selectionBehavior"
      | "selectionMode"
    >,
    PopoverFloatingProps {
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
      allowDuplicateSelectionEvents: true,
      disallowEmptySelection: access(props.selectionMode) !== "multiple",
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
  const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();

  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy>();

  const isSingleSelectMode = () => access(local.selectionMode) === "single";

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

      if (isSingleSelectMode()) {
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

  const toggle = (focusStrategy?: FocusStrategy) => {
    // Don't open if the collection is empty.
    if (listState.collection().getSize() <= 0) {
      return;
    }

    setFocusStrategy(focusStrategy);
    disclosureState.toggle();
  };

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

  // TODO: handle label, description and errorMessage aria-*

  const context: SelectContextValue = {
    isOpen: () => disclosureState.isOpen(),
    isDisabled: () => local.isDisabled ?? false,
    isSingleSelectMode,
    autoFocus: () => focusStrategy() || true,
    listState: () => listState,
    keyboardDelegate: delegate,
    listboxId,
    triggerId,
    toggle,
    generateId: part => `${local.id!}-${part}`,
    setTriggerRef,
    registerTrigger: id => {
      setTriggerId(id);
      return () => setTriggerId(undefined);
    },
    registerListbox: id => {
      setListboxId(id);
      return () => setListboxId(undefined);
    },
  };

  return (
    <Popover
      id={local.id}
      isOpen={disclosureState.isOpen()}
      onOpenChange={disclosureState.setIsOpen}
      anchorRef={triggerRef}
      sameWidth
      {...others}
    >
      <SelectContext.Provider value={context}>{props.children}</SelectContext.Provider>
    </Popover>
  );
};

Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Icon = SelectIcon;
Select.Panel = SelectPanel;
Select.Menu = SelectMenu;

Select.Positioner = PopoverPositioner;
Select.Arrow = PopoverArrow;

Select.Portal = DialogPortal;

Select.Group = ListboxGroup;
Select.GroupLabel = ListboxGroupLabel;
Select.GroupOptions = ListboxGroupOptions;
Select.Option = ListboxOption;
Select.OptionLabel = ListboxOptionLabel;
Select.OptionDescription = ListboxOptionDescription;
Select.OptionIndicator = ListboxOptionIndicator;

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
