/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/useSelect.ts
 */

import { access, createGenerateId, MaybeAccessor, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

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
import { Listbox } from "../listbox";
import { Popover, PopoverFloatingProps } from "../popover";
import {
  CollectionItem,
  createDisclosureState,
  createFormResetListener,
  createRegisterId,
  focusSafely,
} from "../primitives";
import { FocusStrategy, KeyboardDelegate, SelectionMode } from "../selection";
import { Separator } from "../separator";
import { HiddenSelect } from "./hidden-select";
import { SelectContext, SelectContextValue } from "./select-context";
import { SelectIcon } from "./select-icon";
import { SelectLabel } from "./select-label";
import { SelectListbox } from "./select-listbox";
import { SelectPanel } from "./select-panel";
import { SelectTrigger } from "./select-trigger";
import { SelectValue } from "./select-value";

export type SelectBaseComposite = {
  Label: typeof SelectLabel;
  Description: typeof FormControlDescription;
  ErrorMessage: typeof FormControlErrorMessage;
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Icon: typeof SelectIcon;
  Portal: typeof Popover.Portal;
  Positioner: typeof Popover.Positioner;
  Arrow: typeof Popover.Arrow;
  Panel: typeof SelectPanel;
  Listbox: typeof SelectListbox;
  Separator: typeof Separator;
  Group: typeof Listbox.Group;
  GroupLabel: typeof Listbox.GroupLabel;
  Option: typeof Listbox.Option;
  OptionLabel: typeof Listbox.OptionLabel;
  OptionDescription: typeof Listbox.OptionDescription;
  OptionIndicator: typeof Listbox.OptionIndicator;
};

export interface SelectBaseProps
  extends Pick<
      CreateListStateProps,
      "allowDuplicateSelectionEvents" | "disallowEmptySelection" | "selectionBehavior"
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
  value?: Iterable<string>;

  /**
   * The value of the select when initially rendered.
   * Useful when you do not need to control the state.
   */
  defaultValue?: Iterable<string>;

  /** Event handler called when the value changes. */
  onValueChange?: (value: Set<string>) => void;

  /** An optional keyboard delegate implementation for type to select, to override the default. */
  keyboardDelegate?: KeyboardDelegate;

  /** The type of selection that is allowed in the select. */
  selectionMode?: Exclude<SelectionMode, "none">;

  /**
   * Describes the type of autocomplete functionality the input should provide if any.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete).
   */
  autoComplete?: string;
}

export const Select: ParentComponent<SelectBaseProps> & SelectBaseComposite = props => {
  const defaultId = `select-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      selectionMode: "single",
      allowDuplicateSelectionEvents: true,
      disallowEmptySelection: props.selectionMode !== "multiple",
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
      "onValueChange",
      "keyboardDelegate",
      "autoComplete",
      "allowDuplicateSelectionEvents",
      "disallowEmptySelection",
      "selectionBehavior",
      "selectionMode",
    ],
    FORM_CONTROL_PROP_NAMES
  );

  const [triggerId, setTriggerId] = createSignal<string>();
  const [valueId, setValueId] = createSignal<string>();
  const [listboxId, setListboxId] = createSignal<string>();

  const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();
  const [listboxRef, setListboxRef] = createSignal<HTMLDivElement>();

  const [listboxAriaLabelledBy, setListboxAriaLabelledBy] = createSignal<string>();
  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy>();

  const [items, setItems] = createSignal<CollectionItem[]>([]);

  const disclosureState = createDisclosureState({
    isOpen: () => local.isOpen,
    defaultIsOpen: () => local.defaultIsOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const focusTrigger = () => {
    const triggerEl = triggerRef();

    if (triggerEl) {
      focusSafely(triggerEl);
    }
  };

  const focusListbox = () => {
    const listboxEl = listboxRef();

    if (listboxEl) {
      focusSafely(listboxEl);
    }
  };

  const open = (focusStrategy?: FocusStrategy) => {
    // Don't open if the collection is empty.
    if (listState.collection().getSize() <= 0) {
      return;
    }

    setFocusStrategy(focusStrategy);
    disclosureState.open();

    let focusedKey = listState.selectionManager().firstSelectedKey();

    if (focusedKey == null) {
      focusedKey =
        focusStrategy === "last"
          ? listState.collection().getLastKey()
          : listState.collection().getFirstKey();
    }

    focusListbox();
    listState.selectionManager().setFocused(true);
    listState.selectionManager().setFocusedKey(focusedKey, focusStrategy);
  };

  const close = (focusStrategy?: FocusStrategy) => {
    setFocusStrategy(focusStrategy);
    disclosureState.close();

    focusTrigger();
    listState.selectionManager().setFocused(false);
    listState.selectionManager().setFocusedKey(undefined);
  };

  const toggle = (focusStrategy?: FocusStrategy) => {
    if (disclosureState.isOpen()) {
      close(focusStrategy);
    } else {
      open(focusStrategy);
    }
  };

  const listState = createListState({
    selectedKeys: () => local.value,
    defaultSelectedKeys: () => local.defaultValue,
    onSelectionChange: keys => {
      local.onValueChange?.(keys);

      if (local.selectionMode === "single") {
        close();
      }
    },
    allowDuplicateSelectionEvents: () => access(local.allowDuplicateSelectionEvents),
    disallowEmptySelection: () => access(local.disallowEmptySelection),
    selectionBehavior: () => access(local.selectionBehavior),
    selectionMode: () => local.selectionMode,
    dataSource: items,
  });

  const { formControlContext } = createFormControl(formControlProps);

  createFormResetListener(triggerRef, () => {
    if (local.defaultValue != null) {
      listState.selectionManager().setSelectedKeys(local.defaultValue);
    } else {
      listState.selectionManager().clearSelection();
    }
  });

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
    isMultiple: () => access(local.selectionMode) === "multiple",
    autoFocus: () => focusStrategy() || true,
    triggerRef,
    listState: () => listState,
    keyboardDelegate: delegate,
    items,
    setItems,
    triggerId,
    valueId,
    listboxId,
    listboxAriaLabelledBy,
    setListboxAriaLabelledBy,
    setTriggerRef,
    setListboxRef,
    open,
    close,
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
          forceMount
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
Select.Description = FormControlDescription;
Select.ErrorMessage = FormControlErrorMessage;
Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Icon = SelectIcon;
Select.Portal = Popover.Portal;
Select.Positioner = Popover.Positioner;
Select.Arrow = Popover.Arrow;
Select.Panel = SelectPanel;
Select.Listbox = SelectListbox;
Select.Separator = Separator;
Select.Group = Listbox.Group;
Select.GroupLabel = Listbox.GroupLabel;
Select.Option = Listbox.Option;
Select.OptionLabel = Listbox.OptionLabel;
Select.OptionDescription = Listbox.OptionDescription;
Select.OptionIndicator = Listbox.OptionIndicator;
