/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useOption.ts
 */

import {
  combineProps,
  createPolymorphicComponent,
  isMac,
  isWebKit,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  createDomCollectionItem,
  createFocusRing,
  createHover,
  isKeyboardFocusVisible,
} from "../primitives";
import { getItemCount } from "../primitives/create-collection/get-item-count";
import { createSelectableItem } from "../selection";
import { useListBoxContext } from "./list-box-context";
import {
  ListBoxOptionContext,
  ListBoxOptionContextValue,
  ListBoxOptionDataSet,
} from "./list-box-option-context";
import { ListBoxItem } from "./types";

export interface ListBoxOptionProps {
  /** A unique value for the option. */
  value: string;

  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the .textContent of the ListBox.OptionLabel part
   * if provided, or fallback to the .textContent of the ListBox.Option.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;

  /** Whether the option is disabled. */
  isDisabled?: boolean;
}

/**
 * An option of the listbox.
 */
export const ListBoxOption = createPolymorphicComponent<"li", ListBoxOptionProps>(props => {
  let ref: HTMLLIElement | undefined;

  const listBoxContext = useListBoxContext();

  const defaultId = `${listBoxContext.generateId("option")}-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "li",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "value",
    "textValue",
    "isDisabled",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
  ]);

  const [labelId, setLabelId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const [labelRef, setLabelRef] = createSignal<HTMLElement>();

  const selectionManager = () => listBoxContext.listState().selectionManager();

  const isFocused = () => selectionManager().focusedKey() === local.value;

  createDomCollectionItem<ListBoxItem>({
    getItem: () => ({
      ref: () => ref,
      value: local.value,
      textValue: local.textValue ?? labelRef()?.textContent ?? ref?.textContent ?? "",
      isDisabled: !!local.isDisabled,
    }),
    shouldRegisterItem: () => !local.isDisabled,
  });

  const selectableItem = createSelectableItem(
    {
      key: () => local.value,
      selectionManager: selectionManager,
      shouldSelectOnPressUp: listBoxContext.shouldSelectOnPressUp,
      allowsDifferentPressOrigin: () => {
        return listBoxContext.shouldSelectOnPressUp() && listBoxContext.shouldFocusOnHover();
      },
      isVirtualized: listBoxContext.isVirtualized,
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

  const ariaPosInSet = () => {
    if (!listBoxContext.isVirtualized()) {
      return undefined;
    }

    const index = listBoxContext.listState().collection().getItem(local.value)?.index;

    return index != null ? index + 1 : undefined;
  };

  const ariaSetSize = () => {
    if (!listBoxContext.isVirtualized()) {
      return undefined;
    }

    return getItemCount(listBoxContext.listState().collection());
  };

  const dataset: Accessor<ListBoxOptionDataSet> = createMemo(() => ({
    "data-disabled": selectableItem.isDisabled() ? "" : undefined,
    "data-selected": selectableItem.isSelected() ? "" : undefined,
    "data-hover": isHovered() && !listBoxContext.shouldFocusOnHover() ? "" : undefined,
    "data-focus": isFocused() ? "" : undefined,
    "data-focus-visible": isFocusVisible() ? "" : undefined,
    "data-active": selectableItem.isPressed() ? "" : undefined,
  }));

  const context: ListBoxOptionContextValue = {
    dataset,
    setLabelRef,
    generateId: part => `${others.id!}-${part}`,
    registerLabel: id => {
      setLabelId(id);
      return () => setLabelId(undefined);
    },
    registerDescription: id => {
      setDescriptionId(id);
      return () => setDescriptionId(undefined);
    },
  };

  return (
    <ListBoxOptionContext.Provider value={context}>
      <Dynamic
        component={local.as}
        role="option"
        tabIndex={selectableItem.tabIndex()}
        aria-disabled={selectableItem.isDisabled()}
        aria-selected={ariaSelected()}
        aria-label={ariaLabel()}
        aria-labelledby={ariaLabelledBy()}
        aria-describedby={ariaDescribedBy()}
        aria-posinset={ariaPosInSet()}
        aria-setsize={ariaSetSize()}
        data-key={selectableItem.dataKey()}
        {...dataset()}
        {...combineProps(
          { ref: el => (ref = el) },
          others,
          selectableItem.handlers.press,
          // selectableItem.handlers.longPress,
          selectableItem.handlers.others,
          hoverHandlers,
          focusRingHandlers
        )}
      />
    </ListBoxOptionContext.Provider>
  );
});
