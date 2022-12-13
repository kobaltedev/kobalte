/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/useSelect.ts
 */

import { access, createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import { DialogPortal } from "../dialog/dialog-portal";
import {
  createFormControl,
  CreateFormControlProps,
  FORM_CONTROL_PROP_NAMES,
  FormControlContext,
  FormControlDescription,
  FormControlErrorMessage,
} from "../form-control";
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
import { PopoverPositioner } from "../popover/popover-positioner";
import {
  CollectionKey,
  createDisclosure,
  createFormResetListener,
  createRegisterId,
} from "../primitives";
import { FocusStrategy, KeyboardDelegate, SelectionType } from "../selection";
import { HiddenSelect } from "./hidden-select";
import { SelectContext, SelectContextValue } from "./select-context";
import { SelectIcon } from "./select-icon";
import { SelectLabel } from "./select-label";
import { SelectMenu } from "./select-menu";
import { SelectTrigger } from "./select-trigger";
import { SelectValue } from "./select-value";

type SelectComposite = {
  Label: typeof SelectLabel;
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Icon: typeof SelectIcon;
  Menu: typeof SelectMenu;

  Description: typeof FormControlDescription;
  ErrorMessage: typeof FormControlErrorMessage;

  Positioner: typeof PopoverPositioner;
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
    PopoverFloatingProps,
    CreateFormControlProps {
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
   * Describes the type of autocomplete functionality the input should provide if any.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete).
   */
  autoComplete?: string;

  /**
   * Used to force mounting the select when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

export const Select: ParentComponent<SelectProps> & SelectComposite = props => {
  const defaultId = `select-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      selectionMode: "single",
      allowDuplicateSelectionEvents: true,
      disallowEmptySelection:
        access(props.selectionMode) == null || access(props.selectionMode) == "single",
      gutter: 8,
    },
    props
  );

  const [local, formControlProps, others] = splitProps(
    props,
    [
      "children",
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
      "autoComplete",
      "allowDuplicateSelectionEvents",
      "disallowEmptySelection",
      "selectionBehavior",
      "selectionMode",
      "filter",
    ],
    FORM_CONTROL_PROP_NAMES
  );

  const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();
  const [triggerId, setTriggerId] = createSignal<string>();
  const [valueId, setValueId] = createSignal<string>();
  const [listboxId, setListboxId] = createSignal<string>();

  const [menuAriaLabelledBy, setMenuAriaLabelledBy] = createSignal<string>();
  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy>();
  const [isFocused, setIsFocused] = createSignal(false);

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
      isSingleSelectMode() && disclosureState.close();
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

  const { formControlContext } = createFormControl(formControlProps);

  createFormResetListener(triggerRef, () => {
    if (local.defaultValue === "all") {
      listState.selectionManager().selectAll();
    } else if (local.defaultValue != null) {
      listState.selectionManager().setSelectedKeys(local.defaultValue);
    } else {
      listState.selectionManager().clearSelection();
    }
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

  const context: SelectContextValue = {
    isOpen: disclosureState.isOpen,
    isDisabled: () => formControlContext.isDisabled() ?? false,
    isSingleSelectMode,
    autoFocus: () => focusStrategy() || true,
    triggerRef,
    listState: () => listState,
    keyboardDelegate: delegate,
    triggerId,
    valueId,
    listboxId,
    isFocused,
    menuAriaLabelledBy,
    setIsFocused,
    setMenuAriaLabelledBy,
    setTriggerRef,
    close: disclosureState.close,
    toggle,
    generateId: createGenerateId(() => access(formControlProps.id)!),
    registerTrigger: createRegisterId(setTriggerId),
    registerValue: createRegisterId(setValueId),
    registerListbox: createRegisterId(setListboxId),
  };

  return (
    <FormControlContext.Provider value={formControlContext}>
      <SelectContext.Provider value={context}>
        <Popover
          id={access(formControlProps.id)}
          isOpen={disclosureState.isOpen()}
          onOpenChange={disclosureState.setIsOpen}
          anchorRef={triggerRef}
          sameWidth
          {...others}
        >
          <HiddenSelect autoComplete={local.autoComplete} />
          {props.children}
        </Popover>
      </SelectContext.Provider>
    </FormControlContext.Provider>
  );
};

Select.Label = SelectLabel;
Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Icon = SelectIcon;
Select.Menu = SelectMenu;

Select.Description = FormControlDescription;
Select.ErrorMessage = FormControlErrorMessage;

Select.Positioner = PopoverPositioner;
Select.Portal = DialogPortal;

Select.Group = ListboxGroup;
Select.GroupLabel = ListboxGroupLabel;
Select.GroupOptions = ListboxGroupOptions;
Select.Option = ListboxOption;
Select.OptionLabel = ListboxOptionLabel;
Select.OptionDescription = ListboxOptionDescription;
Select.OptionIndicator = ListboxOptionIndicator;
