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

import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useTabsContext } from "./tabs-context";
import { TabsItemModel } from "./types";

export interface TabsTriggerProps {
  /** The unique key that associates the trigger with a panel. */
  key: string;

  /** Whether the tab should be disabled. */
  isDisabled?: boolean;
}

/**
 * The button that activates its associated tabs panel.
 */
export const TabsTrigger = createPolymorphicComponent<"button", TabsTriggerProps>(props => {
  let ref: HTMLButtonElement | undefined;

  const context = useTabsContext();

  props = mergeDefaultProps(
    {
      as: "button",
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "key", "id", "isDisabled"]);

  const id = () => local.id ?? context.generateTabId(local.key);

  const isDisabled = () => local.isDisabled || context.isDisabled();

  createDomCollectionItem<TabsItemModel>({
    getItem: () => ({
      ref: () => ref,
      key: local.key,
      label: ref?.textContent ?? "",
      textValue: ref?.textContent ?? "",
      disabled: isDisabled(),
    }),
  });

  const {
    tabIndex,
    dataKey,
    isSelected,
    pressHandlers: itemPressHandlers,
    longPressHandlers: itemLongPressHandlers,
    otherHandlers: itemOtherHandlers,
  } = createSelectableItem(
    {
      key: () => local.key,
      selectionManager: () => context.listState().selectionManager(),
      isDisabled,
    },
    () => ref
  );

  createEffect(
    on([() => local.key, id], ([key, id]) => {
      context.tabsIdsMap().set(key, id);
    })
  );

  return (
    <Dynamic
      component={local.as}
      id={id()}
      role="tab"
      tabIndex={!isDisabled() ? tabIndex() : undefined}
      aria-selected={isSelected()}
      aria-disabled={isDisabled() || undefined}
      aria-controls={isSelected() ? context.tabPanelsIdsMap().get(local.key) : undefined}
      data-key={dataKey()}
      {...combineProps(
        { ref: el => (ref = el) },
        others,
        itemPressHandlers,
        itemLongPressHandlers,
        itemOtherHandlers
      )}
    />
  );
});
