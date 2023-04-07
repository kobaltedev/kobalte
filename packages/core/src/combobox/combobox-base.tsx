import {
  access,
  createGenerateId,
  focusWithoutScrolling,
  isAppleDevice,
  mergeDefaultProps,
  OverrideComponentProps,
  ValidationState,
} from "@kobalte/utils";
import {
  Accessor,
  Component,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  JSX,
  on,
  splitProps,
} from "solid-js";

import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { createMessageFormatter } from "../i18n";
import { createListState, ListKeyboardDelegate } from "../list";
import { announce } from "../live-announcer";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { PopperRoot, PopperRootOptions } from "../popper";
import {
  CollectionNode,
  createControllableSignal,
  createDisclosureState,
  createFormResetListener,
  createPresence,
  createRegisterId,
  getItemCount,
} from "../primitives";
import {
  createSelectableCollection,
  FocusStrategy,
  KeyboardDelegate,
  Selection,
  SelectionBehavior,
  SelectionMode,
} from "../selection";
import { COMBOBOX_INTL_MESSAGES } from "./combobox.intl";
import { ComboboxContext, ComboboxContextValue, ComboboxDataSet } from "./combobox-context";
import { ComboboxTriggerMode } from "./types";

export interface ComboboxBaseItemComponentProps<T> {
  /** The item to render. */
  item: CollectionNode<T>;
}

export interface ComboboxBaseSectionComponentProps<T> {
  /** The section to render. */
  section: CollectionNode<T>;
}

export interface ComboboxBaseOptions<Option, OptGroup = never>
  extends Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange">,
    AsChildProp {
  /** The controlled open state of the combobox. */
  open?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultOpen?: boolean;

  /**
   * Event handler called when the open state of the combobox changes.
   * Returns the new open state and the action that caused the opening of the menu.
   */
  onOpenChange?: (isOpen: boolean, triggerMode?: ComboboxTriggerMode) => void;

  /** The value of the combobox input (controlled). */
  inputValue?: string;

  /** The default value of the combobox input (uncontrolled). */
  defaultInputValue?: string;

  /** Handler that is called when the combobox input value changes. */
  onInputChange?: (value: string) => void;

  /** The controlled value of the combobox. */
  value?: Iterable<string>;

  /**
   * The value of the combobox when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: Iterable<string>;

  /** Event handler called when the value changes. */
  onChange?: (value: Set<string>) => void;

  /** The string representation of the selected values to display in the `Combobox.Input`.  */
  displayValue?: (values: Set<string>) => string;

  /** The interaction required to display the combobox menu. */
  triggerMode?: ComboboxTriggerMode;

  /** The content that will be rendered when no value or defaultValue is set. */
  placeholder?: JSX.Element;

  /** An array of options to display as the available options. */
  options?: Array<Option | OptGroup>;

  /** Property name or getter function to use as the value of an option. */
  optionValue?: keyof Option | ((option: Option) => string);

  /** Property name or getter function to use as the text value of an option for typeahead purpose. */
  optionTextValue?: keyof Option | ((option: Option) => string);

  /** Property name or getter function to use as the disabled flag of an option. */
  optionDisabled?: keyof Option | ((option: Option) => boolean);

  /** Property name or getter function that refers to the children options of an option group. */
  optionGroupChildren?: keyof OptGroup | ((optGroup: OptGroup) => Option[]);

  /** Function used to check if an option is an option group. */
  isOptionGroup?: (maybeOptGroup: OptGroup) => boolean;

  /** An optional keyboard delegate to override the default. */
  keyboardDelegate?: KeyboardDelegate;

  /** Whether focus should wrap around when the end/start is reached. */
  shouldFocusWrap?: boolean;

  /** Whether the combobox allows the menu to be open when the collection is empty. */
  allowsEmptyCollection?: boolean;

  /** The type of selection that is allowed in the select. */
  selectionMode?: Exclude<SelectionMode, "none">;

  /** How multiple selection should behave in the select. */
  selectionBehavior?: SelectionBehavior;

  /** Whether onValueChange should fire even if the new set of keys is the same as the last. */
  allowDuplicateSelectionEvents?: boolean;

  /** Whether the combobox allows empty selection. */
  disallowEmptySelection?: boolean;

  /** Whether the combobox uses virtual scrolling. */
  virtualized?: boolean;

  /** When NOT virtualized, the component to render as an item in the `Combobox.Listbox`. */
  itemComponent?: Component<ComboboxBaseItemComponentProps<Option>>;

  /** When NOT virtualized, the component to render as a section in the `Combobox.Listbox`. */
  sectionComponent?: Component<ComboboxBaseSectionComponentProps<OptGroup>>;

  /**
   * Whether the combobox should be the only visible content for screen readers.
   * When set to `true`:
   * - interaction with outside elements will be disabled.
   * - scroll will be locked.
   * - focus will be locked inside the select content.
   * - elements outside the combobox content will not be visible for screen readers.
   */
  modal?: boolean;

  /**
   * Used to force mounting the combobox (portal, positioner and content) when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /**
   * The name of the combobox.
   * Submitted with its owning form as part of a name/value pair.
   */
  name?: string;

  /** Whether the combobox should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must select an item before the owning form can be submitted. */
  required?: boolean;

  /** Whether the combobox is disabled. */
  disabled?: boolean;

  /** Whether the combobox is read only. */
  readOnly?: boolean;

  /** The children of the combobox. */
  children?: JSX.Element;
}

export interface ComboboxBaseProps<Option, OptGroup = never>
  extends OverrideComponentProps<"div", ComboboxBaseOptions<Option, OptGroup>>,
    AsChildProp {}

/**
 * Base component for a combobox, provide context for its children.
 */
export function ComboboxBase<Option, OptGroup = never>(props: ComboboxBaseProps<Option, OptGroup>) {
  const defaultId = `combobox-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      selectionMode: "single",
      disallowEmptySelection: true,
      allowDuplicateSelectionEvents: true,
      gutter: 8,
      sameWidth: true,
      modal: false,
      triggerMode: "input",
      allowsEmptyCollection: false,
    },
    props
  );

  const [local, popperProps, formControlProps, others] = splitProps(
    props,
    [
      "itemComponent",
      "sectionComponent",
      "open",
      "defaultOpen",
      "onOpenChange",
      "inputValue",
      "defaultInputValue",
      "onInputChange",
      "value",
      "defaultValue",
      "onChange",
      "displayValue",
      "triggerMode",
      "placeholder",
      "options",
      "optionValue",
      "optionTextValue",
      "optionDisabled",
      "optionGroupChildren",
      "isOptionGroup",
      "keyboardDelegate",
      "allowDuplicateSelectionEvents",
      "disallowEmptySelection",
      "shouldFocusWrap",
      "allowsEmptyCollection",
      "selectionBehavior",
      "selectionMode",
      "virtualized",
      "modal",
      "forceMount",
    ],
    [
      "getAnchorRect",
      "placement",
      "gutter",
      "shift",
      "flip",
      "slide",
      "overlap",
      "sameWidth",
      "fitViewport",
      "hideWhenDetached",
      "detachedPadding",
      "arrowPadding",
      "overflowPadding",
    ],
    FORM_CONTROL_PROP_NAMES
  );

  const [inputId, setInputId] = createSignal<string>();
  const [valueId, setValueId] = createSignal<string>();
  const [listboxId, setListboxId] = createSignal<string>();

  const [triggerRef, setTriggerRef] = createSignal<HTMLDivElement>();
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
  const [buttonRef, setButtonRef] = createSignal<HTMLButtonElement>();
  const [contentRef, setContentRef] = createSignal<HTMLDivElement>();
  const [listboxRef, setListboxRef] = createSignal<HTMLUListElement>();

  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy | boolean>(false);

  const [isInputFocused, setIsInputFocusedState] = createSignal(false);
  const [shouldResetInputAfterClose, setShouldResetInputAfterClose] = createSignal(false);
  const [closeOnSingleSelect, setCloseOnSingleSelect] = createSignal(true);

  const messageFormatter = createMessageFormatter(() => COMBOBOX_INTL_MESSAGES);

  // Track what action is attempting to open the combobox.
  let openTriggerMode: ComboboxTriggerMode | undefined = "focus";

  // Track the text value to display in the input (in single selection mode).
  let lastDisplayValue = "";

  const resetInputAfterClose = () => {
    setShouldResetInputAfterClose(true);
  };

  const [inputValue, setInputValue] = createControllableSignal({
    value: () => local.inputValue,
    defaultValue: () => local.defaultInputValue,
    onChange: value => {
      local.onInputChange?.(value);

      // Remove selection when input is cleared in single selection mode.
      if (
        listState.selectionManager().selectionMode() === "single" &&
        !listState.selectionManager().isEmpty() &&
        value === ""
      ) {
        // Bypass single selection close behavior and `disallowEmptySelection`.
        setCloseOnSingleSelect(false);
        listState.selectionManager().setSelectedKeys([]);
      }

      // Clear focused key when input value changes.
      listState.selectionManager().setFocusedKey(undefined);
    },
  });

  const disclosureState = createDisclosureState({
    open: () => local.open,
    defaultOpen: () => local.defaultOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen, openTriggerMode),
  });

  const listState = createListState({
    selectedKeys: () => local.value,
    defaultSelectedKeys: () => local.defaultValue,
    onSelectionChange: keys => {
      local.onChange?.(keys);

      if (local.selectionMode === "single") {
        lastDisplayValue = local.displayValue?.(keys) ?? "";

        if (closeOnSingleSelect()) {
          close();
        }

        if (contentPresence.isPresent()) {
          resetInputAfterClose();
        } else {
          resetInputValue();
        }
      } else {
        // Clear and bring back focus to the input after selection.
        setInputValue("");
        focusWithoutScrolling(inputRef());
      }

      // Restore the signal to initial value.
      if (!closeOnSingleSelect()) {
        setCloseOnSingleSelect(true);
      }
    },
    allowDuplicateSelectionEvents: () => access(local.allowDuplicateSelectionEvents),
    disallowEmptySelection: () => access(local.disallowEmptySelection),
    selectionBehavior: () => access(local.selectionBehavior),
    selectionMode: () => local.selectionMode,
    dataSource: () => local.options ?? [],
    getKey: () => local.optionValue as any,
    getTextValue: () => local.optionTextValue as any,
    getDisabled: () => local.optionDisabled as any,
    getSectionChildren: () => local.optionGroupChildren as any,
    getIsSection: () => local.isOptionGroup,
  });

  const contentPresence = createPresence(() => local.forceMount || disclosureState.isOpen());

  const open = (focusStrategy: FocusStrategy | boolean, triggerMode?: ComboboxTriggerMode) => {
    // Don't open if the collection is empty.
    if (!local.allowsEmptyCollection && listState.collection().getSize() <= 0) {
      return;
    }

    openTriggerMode = triggerMode;
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

    listState.selectionManager().setFocused(true);
    listState.selectionManager().setFocusedKey(focusedKey);
  };

  const close = () => {
    disclosureState.close();

    listState.selectionManager().setFocused(false);
    listState.selectionManager().setFocusedKey(undefined);
  };

  const toggle = (focusStrategy: FocusStrategy | boolean, triggerMode?: ComboboxTriggerMode) => {
    if (disclosureState.isOpen()) {
      close();
    } else {
      open(focusStrategy, triggerMode);
    }
  };

  const { formControlContext } = createFormControl(formControlProps);

  createFormResetListener(inputRef, () => {
    listState.selectionManager().setSelectedKeys(local.defaultValue ?? new Selection());
  });

  // By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
  const delegate = createMemo(() => {
    const keyboardDelegate = access(local.keyboardDelegate);

    if (keyboardDelegate) {
      return keyboardDelegate;
    }

    return new ListKeyboardDelegate(listState.collection, listboxRef, undefined);
  });

  // Use `createSelectableCollection` to get the keyboard handlers to apply to the input.
  const selectableCollection = createSelectableCollection(
    {
      selectionManager: () => listState.selectionManager(),
      keyboardDelegate: delegate,
      disallowTypeAhead: true,
      disallowEmptySelection: true,
      shouldFocusWrap: () => local.shouldFocusWrap,
      // Prevent item scroll behavior from being applied here, handled in the Listbox component.
      isVirtualized: true,
    },
    inputRef
  );

  const setIsInputFocused = (isFocused: boolean) => {
    if (isFocused && local.triggerMode === "focus") {
      open(false, "focus");
    }

    setIsInputFocusedState(isFocused);
  };

  const activeDescendant = createMemo(() => {
    const focusedKey = listState.selectionManager().focusedKey();

    if (focusedKey) {
      return listboxRef()?.querySelector(`[data-key="${focusedKey}"]`)?.id;
    }

    return undefined;
  });

  const resetInputValue = () => {
    if (listState.selectionManager().selectionMode() === "single") {
      setInputValue(lastDisplayValue);
    } else {
      setInputValue("");
    }
  };

  const renderItem = (item: CollectionNode) => {
    return local.itemComponent?.({ item });
  };

  const renderSection = (section: CollectionNode) => {
    return local.sectionComponent?.({ section });
  };

  // Reset input only after combobox close animation is done
  // to prevent a collection update when animating out.
  createEffect(
    on(
      () => contentPresence.isPresent(),
      isPresent => {
        if (!isPresent && shouldResetInputAfterClose()) {
          resetInputValue();
          setShouldResetInputAfterClose(false);
        }
      },
      {
        defer: true,
      }
    )
  );

  // VoiceOver has issues with announcing aria-activedescendant properly on change.
  // We use a live region announcer to announce focus changes manually.
  let lastAnnouncedFocusedKey = "";

  createEffect(() => {
    const focusedKey = listState.selectionManager().focusedKey() ?? "";
    const focusedItem = listState.collection().getItem(focusedKey);

    if (isAppleDevice() && focusedItem != null && focusedKey !== lastAnnouncedFocusedKey) {
      const isSelected = listState.selectionManager().isSelected(focusedKey);

      const announcement = messageFormatter().format("focusAnnouncement", {
        optionText: focusedItem?.textValue || "",
        isSelected,
      });

      announce(announcement);
    }

    if (focusedKey) {
      lastAnnouncedFocusedKey = focusedKey;
    }
  });

  // Announce the number of available suggestions when it changes.
  let lastOptionCount = getItemCount(listState.collection());
  let lastOpen = disclosureState.isOpen();

  createEffect(() => {
    const optionCount = getItemCount(listState.collection());
    const isOpen = disclosureState.isOpen();

    // Only announce the number of options available when the menu opens if there is no
    // focused item, otherwise screen readers will typically read e.g. "1 of 6".
    // The exception is VoiceOver since this isn't included in the message above.
    const didOpenWithoutFocusedItem =
      isOpen !== lastOpen && (listState.selectionManager().focusedKey() == null || isAppleDevice());

    if (isOpen && (didOpenWithoutFocusedItem || optionCount !== lastOptionCount)) {
      const announcement = messageFormatter().format("countAnnouncement", { optionCount });
      announce(announcement);
    }

    lastOptionCount = optionCount;
    lastOpen = isOpen;
  });

  // Announce when a selection occurs for VoiceOver.
  // Other screen readers typically do this automatically.
  let lastAnnouncedSelectedKey = "";

  createEffect(() => {
    const lastSelectedKey = [...listState.selectionManager().selectedKeys()].pop() ?? "";
    const lastSelectedItem = listState.collection().getItem(lastSelectedKey);

    if (
      isAppleDevice() &&
      isInputFocused() &&
      lastSelectedItem &&
      lastSelectedKey !== lastAnnouncedSelectedKey
    ) {
      const announcement = messageFormatter().format("selectedAnnouncement", {
        optionText: lastSelectedItem?.textValue || "",
      });

      announce(announcement);
    }

    if (lastSelectedKey) {
      lastAnnouncedSelectedKey = lastSelectedKey;
    }
  });

  const dataset: Accessor<ComboboxDataSet> = createMemo(() => ({
    "data-expanded": disclosureState.isOpen() ? "" : undefined,
    "data-closed": !disclosureState.isOpen() ? "" : undefined,
  }));

  const context: ComboboxContextValue = {
    dataset,
    isOpen: disclosureState.isOpen,
    isDisabled: () => formControlContext.isDisabled() ?? false,
    isMultiple: () => access(local.selectionMode) === "multiple",
    isVirtualized: () => local.virtualized,
    isModal: () => local.modal ?? false,
    allowsEmptyCollection: () => local.allowsEmptyCollection ?? false,
    shouldFocusWrap: () => local.shouldFocusWrap ?? false,
    isInputFocused,
    contentPresence,
    autoFocus: focusStrategy,
    inputValue,
    triggerMode: () => local.triggerMode!,
    activeDescendant,
    triggerRef,
    inputRef,
    buttonRef,
    contentRef,
    listState: () => listState,
    keyboardDelegate: delegate,
    inputId,
    valueId,
    listboxId,
    buttonAriaLabel: () => messageFormatter().format("buttonLabel"),
    listboxAriaLabel: () => messageFormatter().format("listboxLabel"),
    setIsInputFocused,
    resetInputAfterClose,
    resetInputValue,
    setInputValue,
    setTriggerRef,
    setInputRef,
    setButtonRef,
    setContentRef,
    setListboxRef,
    open,
    close,
    toggle,
    placeholder: () => local.placeholder,
    renderItem,
    renderSection,
    onInputKeyDown: e => selectableCollection.onKeyDown(e),
    generateId: createGenerateId(() => access(formControlProps.id)!),
    registerInputId: createRegisterId(setInputId),
    registerValueId: createRegisterId(setValueId),
    registerListboxId: createRegisterId(setListboxId),
  };

  return (
    <FormControlContext.Provider value={formControlContext}>
      <ComboboxContext.Provider value={context}>
        <PopperRoot anchorRef={triggerRef} contentRef={contentRef} {...popperProps}>
          <Polymorphic
            as="div"
            role="group"
            id={access(formControlProps.id)}
            {...formControlContext.dataset()}
            {...dataset()}
            {...others}
          />
        </PopperRoot>
      </ComboboxContext.Provider>
    </FormControlContext.Provider>
  );
}