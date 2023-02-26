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
import { Dynamic } from "solid-js/web";

import { CollectionItemWithRef } from "../primitives";
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

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "id",
    "value",
    "isDisabled",
    "onPointerDown",
    "onPointerUp",
    "onClick",
    "onKeyDown",
    "onMouseDown",
    "onFocus",
  ]);

  const id = () => local.id ?? context.generateTriggerId(local.value);

  const isHighlighted = () => context.listState().selectionManager().focusedKey() === local.value;

  const isDisabled = () => local.isDisabled || context.isDisabled();

  const contentId = () => context.contentIdsMap().get(local.value);

  createDomCollectionItem<CollectionItemWithRef>({
    getItem: () => ({
      ref: () => ref,
      type: "item",
      key: local.value,
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

  createEffect(
    on([() => local.value, id], ([value, id]) => {
      context.triggerIdsMap().set(value, id);
    })
  );

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      id={id()}
      role="tab"
      tabIndex={!isDisabled() ? selectableItem.tabIndex() : undefined}
      disabled={isDisabled()}
      aria-selected={selectableItem.isSelected()}
      aria-disabled={isDisabled() || undefined}
      aria-controls={selectableItem.isSelected() ? contentId() : undefined}
      data-key={selectableItem.dataKey()}
      data-orientation={context.orientation()}
      data-selected={selectableItem.isSelected() ? "" : undefined}
      data-highlighted={isHighlighted() ? "" : undefined}
      data-disabled={isDisabled() ? "" : undefined}
      onPointerDown={composeEventHandlers([local.onPointerDown, selectableItem.onPointerDown])}
      onPointerUp={composeEventHandlers([local.onPointerUp, selectableItem.onPointerUp])}
      onClick={composeEventHandlers([local.onClick, selectableItem.onClick])}
      onKeyDown={composeEventHandlers([local.onKeyDown, selectableItem.onKeyDown])}
      onMouseDown={composeEventHandlers([local.onMouseDown, selectableItem.onMouseDown])}
      onFocus={composeEventHandlers([local.onFocus, selectableItem.onFocus])}
      {...others}
    />
  );
});
