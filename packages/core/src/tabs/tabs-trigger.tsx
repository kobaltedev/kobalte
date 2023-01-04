/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTab.ts
 */

import { combineProps, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, on, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { CollectionItem, createFocusRing, createHover } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useTabsContext } from "./tabs-context";

export interface TabsTriggerOptions {
  /** The unique key that associates the tab with a tab panel. */
  value: string;

  /** Whether the tab should be disabled. */
  isDisabled?: boolean;
}

/**
 * The button that activates its associated tab panel.
 */
export const TabsTrigger = createPolymorphicComponent<"button", TabsTriggerOptions>(props => {
  let ref: HTMLButtonElement | undefined;

  const context = useTabsContext();

  props = mergeDefaultProps(
    {
      as: "button",
      type: "button",
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id", "value", "isDisabled"]);

  const id = () => local.id ?? context.generateTriggerId(local.value);

  const isFocused = () => context.listState().selectionManager().focusedKey() === local.value;

  const isDisabled = () => local.isDisabled || context.isDisabled();

  createDomCollectionItem<CollectionItem>({
    getItem: () => ({
      ref: () => ref,
      key: local.value,
      label: "", // not applicable here
      textValue: "", // not applicable here
      isDisabled: isDisabled(),
    }),
  });

  const {
    tabIndex,
    dataKey,
    isSelected,
    isPressed,
    pressHandlers: itemPressHandlers,
    longPressHandlers: itemLongPressHandlers,
    otherHandlers: itemOtherHandlers,
  } = createSelectableItem(
    {
      key: () => local.value,
      selectionManager: () => context.listState().selectionManager(),
      isDisabled,
    },
    () => ref
  );

  const { isHovered, hoverHandlers } = createHover({
    isDisabled,
  });

  const { isFocusVisible, focusRingHandlers } = createFocusRing();

  createEffect(
    on([() => local.value, id], ([value, id]) => {
      context.triggerIdsMap().set(value, id);
    })
  );

  return (
    <Dynamic
      component={local.as}
      id={id()}
      role="tab"
      tabIndex={!isDisabled() ? tabIndex() : undefined}
      disabled={isDisabled()}
      aria-selected={isSelected()}
      aria-disabled={isDisabled() || undefined}
      aria-controls={isSelected() ? context.contentIdsMap().get(local.value) : undefined}
      data-key={dataKey()}
      data-orientation={context.orientation()}
      data-selected={isSelected() ? "" : undefined}
      data-disabled={isDisabled() ? "" : undefined}
      data-hover={isHovered() ? "" : undefined}
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      data-active={isPressed() ? "" : undefined}
      {...combineProps(
        { ref: el => (ref = el) },
        others,
        itemPressHandlers,
        itemLongPressHandlers,
        itemOtherHandlers,
        hoverHandlers,
        focusRingHandlers
      )}
    />
  );
});
