/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTab.ts
 */

import {
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, on, splitProps } from "solid-js";

import { Pressable, PressableOptions } from "../pressable";
import {
  CollectionItem,
  createFocusRing,
  createHover,
  FOCUS_RING_HANDLERS_PROP_NAMES,
  HOVER_HANDLERS_PROP_NAMES,
} from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useTabsContext } from "./tabs-context";

export interface TabsTriggerOptions extends PressableOptions {
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

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "value",
    "isDisabled",
    "onPressStart",
    "onPressUp",
    "onPress",
    "onLongPress",
    "onFocus",
    "onMouseDown",
    "onDragStart",
    ...HOVER_HANDLERS_PROP_NAMES,
    ...FOCUS_RING_HANDLERS_PROP_NAMES,
  ]);

  const id = () => local.id ?? context.generateTriggerId(local.value);

  const isFocused = () => context.listState().selectionManager().focusedKey() === local.value;

  const isDisabled = () => local.isDisabled || context.isDisabled();

  const contentId = () => context.contentIdsMap().get(local.value);

  createDomCollectionItem<CollectionItem>({
    getItem: () => ({
      ref: () => ref,
      key: local.value,
      label: "", // not applicable here
      textValue: "", // not applicable here
      isDisabled: isDisabled(),
    }),
  });

  const selectableItem = createSelectableItem(
    {
      key: () => local.value,
      selectionManager: () => context.listState().selectionManager(),
      isDisabled,
    },
    () => ref
  );

  const { isHovered, hoverHandlers } = createHover({ isDisabled });

  const { isFocusVisible, focusRingHandlers } = createFocusRing();

  createEffect(
    on([() => local.value, id], ([value, id]) => {
      context.triggerIdsMap().set(value, id);
    })
  );

  return (
    <Pressable
      ref={mergeRefs(el => (ref = el), local.ref)}
      id={id()}
      role="tab"
      tabIndex={!isDisabled() ? selectableItem.tabIndex() : undefined}
      isDisabled={isDisabled()}
      preventFocusOnPress={selectableItem.preventFocusOnPress()}
      aria-selected={selectableItem.isSelected()}
      aria-controls={selectableItem.isSelected() ? contentId() : undefined}
      data-key={selectableItem.dataKey()}
      data-orientation={context.orientation()}
      data-selected={selectableItem.isSelected() ? "" : undefined}
      data-hover={isHovered() ? "" : undefined}
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      onFocus={composeEventHandlers([local.onFocus, selectableItem.onFocus])}
      onPressStart={composeEventHandlers([local.onPressStart, selectableItem.onPressStart])}
      onPressUp={composeEventHandlers([local.onPressUp, selectableItem.onPressUp])}
      onPress={composeEventHandlers([local.onPress, selectableItem.onPress])}
      onLongPress={composeEventHandlers([local.onLongPress, selectableItem.onLongPress])}
      onMouseDown={composeEventHandlers([local.onMouseDown, selectableItem.onMouseDown])}
      onDragStart={composeEventHandlers([local.onDragStart, selectableItem.onDragStart])}
      onPointerEnter={composeEventHandlers([local.onPointerEnter, hoverHandlers.onPointerEnter])}
      onPointerLeave={composeEventHandlers([local.onPointerLeave, hoverHandlers.onPointerLeave])}
      onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
      onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
      {...others}
    />
  );
});
