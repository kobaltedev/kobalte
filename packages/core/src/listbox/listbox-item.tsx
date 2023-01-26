/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useOption.ts
 */

import {
  composeEventHandlers,
  createGenerateId,
  createPolymorphicComponent,
  isMac,
  isWebKit,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  CollectionItem,
  createFocusRing,
  createHover,
  createRegisterId,
  FOCUS_RING_HANDLERS_PROP_NAMES,
  HOVER_HANDLERS_PROP_NAMES,
  isKeyboardFocusVisible,
  PRESS_HANDLERS_PROP_NAMES,
} from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useListboxContext } from "./listbox-context";
import {
  ListboxItemContext,
  ListboxItemContextValue,
  ListboxItemDataSet,
} from "./listbox-item-context";

export interface ListboxItemOptions {
  /** A unique value for the item. */
  value: string;

  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the .textContent of the `Listbox.ItemLabel` part
   * if provided, or fallback to the .textContent of the `Listbox.Item`.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;

  /** Whether the item is disabled. */
  isDisabled?: boolean;
}

/**
 * An item of the listbox.
 */
export const ListboxItem = /*#__PURE__*/ createPolymorphicComponent<"div", ListboxItemOptions>(
  props => {
    let ref: HTMLElement | undefined;

    const listBoxContext = useListboxContext();

    const defaultId = `${listBoxContext.generateId("item")}-${createUniqueId()}`;

    props = mergeDefaultProps(
      {
        as: "div",
        id: defaultId,
      },
      props
    );

    const [local, others] = splitProps(props, [
      "as",
      "ref",
      "value",
      "textValue",
      "isDisabled",
      "aria-label",
      "aria-labelledby",
      "aria-describedby",
      "onFocus",
      ...PRESS_HANDLERS_PROP_NAMES,
      ...HOVER_HANDLERS_PROP_NAMES,
      ...FOCUS_RING_HANDLERS_PROP_NAMES,
    ]);

    const [labelId, setLabelId] = createSignal<string>();
    const [descriptionId, setDescriptionId] = createSignal<string>();

    const [labelRef, setLabelRef] = createSignal<HTMLElement>();

    const selectionManager = () => listBoxContext.listState().selectionManager();

    const isFocused = () => selectionManager().focusedKey() === local.value;

    createDomCollectionItem<CollectionItem>({
      getItem: () => ({
        ref: () => ref,
        key: local.value,
        label: labelRef()?.textContent ?? ref?.textContent ?? "",
        textValue: local.textValue ?? labelRef()?.textContent ?? ref?.textContent ?? "",
        isDisabled: local.isDisabled ?? false,
      }),
    });

    const selectableItem = createSelectableItem(
      {
        key: () => local.value,
        selectionManager: selectionManager,
        shouldSelectOnPressUp: listBoxContext.shouldSelectOnPressUp,
        allowsDifferentPressOrigin: () => {
          return listBoxContext.shouldSelectOnPressUp() && listBoxContext.shouldFocusOnHover();
        },
        shouldUseVirtualFocus: listBoxContext.shouldUseVirtualFocus,
        isDisabled: () => local.isDisabled,
      },
      () => ref
    );

    const { hoverHandlers, isHovered } = createHover({
      isDisabled: () => selectableItem.isDisabled(),
      onHoverStart: () => {
        if (!isKeyboardFocusVisible() && listBoxContext.shouldFocusOnHover()) {
          selectionManager().setFocused(true);
          selectionManager().setFocusedKey(local.value);
        }
      },
    });

    const { isFocusVisible, focusRingHandlers } = createFocusRing();

    const ariaSelected = () => {
      if (selectionManager().selectionMode() === "none") {
        return undefined;
      }

      return selectableItem.isSelected();
    };

    // Safari with VoiceOver on macOS misreads options with aria-labelledby or aria-label as simply "text".
    // We should not map slots to the label and description on Safari and instead just have VoiceOver read the textContent.
    // https://bugs.webkit.org/show_bug.cgi?id=209279
    const isNotSafariMacOS = createMemo(() => !(isMac() && isWebKit()));

    const ariaLabel = () => (isNotSafariMacOS() ? local["aria-label"] : undefined);
    const ariaLabelledBy = () => (isNotSafariMacOS() ? labelId() : undefined);
    const ariaDescribedBy = () => (isNotSafariMacOS() ? descriptionId() : undefined);

    const dataset: Accessor<ListboxItemDataSet> = createMemo(() => ({
      "data-disabled": selectableItem.isDisabled() ? "" : undefined,
      "data-selected": selectableItem.isSelected() ? "" : undefined,
      "data-hover": isHovered() && !listBoxContext.shouldFocusOnHover() ? "" : undefined,
      "data-focus": isFocused() ? "" : undefined,
      "data-focus-visible": isFocusVisible() ? "" : undefined,
      "data-active": selectableItem.isPressed() ? "" : undefined,
    }));

    const context: ListboxItemContextValue = {
      isSelected: selectableItem.isSelected,
      dataset,
      setLabelRef,
      generateId: createGenerateId(() => others.id!),
      registerLabelId: createRegisterId(setLabelId),
      registerDescriptionId: createRegisterId(setDescriptionId),
    };

    return (
      <ListboxItemContext.Provider value={context}>
        <Dynamic
          component={local.as}
          ref={mergeRefs(el => (ref = el), local.ref)}
          role="option"
          tabIndex={selectableItem.tabIndex()}
          aria-disabled={selectableItem.isDisabled()}
          aria-selected={ariaSelected()}
          aria-label={ariaLabel()}
          aria-labelledby={ariaLabelledBy()}
          aria-describedby={ariaDescribedBy()}
          data-key={selectableItem.dataKey()}
          onKeyDown={composeEventHandlers([
            local.onKeyDown,
            selectableItem.pressHandlers.onKeyDown,
            selectableItem.longPressHandlers.onKeyDown,
          ])}
          onKeyUp={composeEventHandlers([
            local.onKeyUp,
            selectableItem.pressHandlers.onKeyUp,
            selectableItem.longPressHandlers.onKeyUp,
          ])}
          onClick={composeEventHandlers([
            local.onClick,
            selectableItem.pressHandlers.onClick,
            selectableItem.longPressHandlers.onClick,
          ])}
          onPointerDown={composeEventHandlers([
            local.onPointerDown,
            selectableItem.pressHandlers.onPointerDown,
            selectableItem.longPressHandlers.onPointerDown,
          ])}
          onPointerUp={composeEventHandlers([
            local.onPointerUp,
            selectableItem.pressHandlers.onPointerUp,
            selectableItem.longPressHandlers.onPointerUp,
          ])}
          onMouseDown={composeEventHandlers([
            local.onMouseDown,
            selectableItem.otherHandlers.onMouseDown,
            selectableItem.pressHandlers.onMouseDown,
            selectableItem.longPressHandlers.onMouseDown,
          ])}
          onDragStart={composeEventHandlers([
            local.onDragStart,
            selectableItem.pressHandlers.onDragStart,
            selectableItem.longPressHandlers.onDragStart,
            selectableItem.otherHandlers.onDragStart,
          ])}
          onPointerEnter={composeEventHandlers([
            local.onPointerEnter,
            hoverHandlers.onPointerEnter,
          ])}
          onPointerLeave={composeEventHandlers([
            local.onPointerLeave,
            hoverHandlers.onPointerLeave,
          ])}
          onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
          onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
          onFocus={composeEventHandlers([local.onFocus, selectableItem.otherHandlers.onFocus])}
          {...dataset()}
          {...others}
        />
      </ListboxItemContext.Provider>
    );
  }
);
