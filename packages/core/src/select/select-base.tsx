/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/useSelect.ts
 */

import { access, createGenerateId, mergeDefaultProps, ValidationState } from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, ParentProps, splitProps } from "solid-js";

import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { createCollator } from "../i18n";
import { createListState, ListKeyboardDelegate } from "../list";
import { PopperRoot, PopperRootOptions } from "../popper";
import {
  CollectionItem,
  createDisclosureState,
  createFormResetListener,
  createRegisterId,
  focusSafely,
} from "../primitives";
import {
  FocusStrategy,
  KeyboardDelegate,
  Selection,
  SelectionBehavior,
  SelectionMode,
} from "../selection";
import { HiddenSelect } from "./hidden-select";
import { SelectContext, SelectContextValue } from "./select-context";

export interface SelectBaseOptions
  extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> {
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
   * Useful when you do not need to control the value.
   */
  defaultValue?: Iterable<string>;

  /** Event handler called when the value changes. */
  onValueChange?: (value: Set<string>) => void;

  /** An optional keyboard delegate implementation for type to select, to override the default. */
  keyboardDelegate?: KeyboardDelegate;

  /** The type of selection that is allowed in the select. */
  selectionMode?: Exclude<SelectionMode, "none">;

  /** How multiple selection should behave in the select. */
  selectionBehavior?: SelectionBehavior;

  /** Whether onValueChange should fire even if the new set of keys is the same as the last. */
  allowDuplicateSelectionEvents?: boolean;

  /** Whether the select allows empty selection. */
  disallowEmptySelection?: boolean;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /**
   * The name of the select.
   * Submitted with its owning form as part of a name/value pair.
   */
  name?: string;

  /** Whether the select should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must select an item before the owning form can be submitted. */
  isRequired?: boolean;

  /** Whether the select is disabled. */
  isDisabled?: boolean;

  /** Whether the select is read only. */
  isReadOnly?: boolean;

  /**
   * Describes the type of autocomplete functionality the input should provide if any.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete).
   */
  autoComplete?: string;
}

/**
 * Base component for a select, provide context for its children.
 * Used to build single and multi-select.
 */
export function SelectBase(props: ParentProps<SelectBaseOptions>) {
  const defaultId = `select-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      selectionMode: "single",
      allowDuplicateSelectionEvents: true,
      disallowEmptySelection: props.selectionMode !== "multiple",
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
  const [contentRef, setContentRef] = createSignal<HTMLDivElement>();
  const [listboxRef, setListboxRef] = createSignal<HTMLDivElement>();

  const [listboxAriaLabelledBy, setListboxAriaLabelledBy] = createSignal<string>();
  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy | boolean>(true);

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

  const open = (focusStrategy: FocusStrategy | boolean) => {
    // Don't open if the collection is empty.
    if (listState.collection().getSize() <= 0) {
      return;
    }

    setFocusStrategy(focusStrategy);
    disclosureState.open();

    let focusedKey = listState.selectionManager().firstSelectedKey();

    if (focusedKey == null) {
      if (focusStrategy === "first") {
        focusedKey = listState.collection().getFirstKey();
      } else if (focusStrategy === "last") {
        focusedKey = listState.collection().getLastKey();
      }
    }

    focusListbox();
    listState.selectionManager().setFocused(true);
    listState.selectionManager().setFocusedKey(focusedKey);
  };

  const close = () => {
    disclosureState.close();

    listState.selectionManager().setFocused(false);
    listState.selectionManager().setFocusedKey(undefined);
    focusTrigger();
  };

  const toggle = (focusStrategy: FocusStrategy | boolean) => {
    if (disclosureState.isOpen()) {
      close();
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
    listState.selectionManager().setSelectedKeys(local.defaultValue ?? new Selection());
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
    autoFocus: focusStrategy,
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
    setContentRef,
    setListboxRef,
    open,
    close,
    toggle,
    generateId: createGenerateId(() => access(formControlProps.id)!),
    registerTriggerId: createRegisterId(setTriggerId),
    registerValueId: createRegisterId(setValueId),
    registerListboxId: createRegisterId(setListboxId),
  };

  return (
    <FormControlContext.Provider value={formControlContext}>
      <SelectContext.Provider value={context}>
        <PopperRoot anchorRef={triggerRef} contentRef={contentRef} sameWidth {...others}>
          <HiddenSelect autoComplete={local.autoComplete} />
          {local.children}
        </PopperRoot>
      </SelectContext.Provider>
    </FormControlContext.Provider>
  );
}
