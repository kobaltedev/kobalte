/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTabList.ts
 */

import { composeEventHandlers, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, splitProps } from "solid-js";

import { useLocale } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { createSelectableCollection } from "../selection";
import { useTabsContext } from "./tabs-context";
import { TabsKeyboardDelegate } from "./tabs-keyboard-delegate";

export interface TabsListProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * Contains the tabs that are aligned along the edge of the active tab panel.
 */
export function TabsList(props: TabsListProps) {
  let ref: HTMLElement | undefined;

  const context = useTabsContext();

  const [local, others] = splitProps(props, [
    "ref",
    "onKeyDown",
    "onMouseDown",
    "onFocusIn",
    "onFocusOut",
  ]);

  const { direction } = useLocale();

  const delegate = new TabsKeyboardDelegate(
    () => context.listState().collection(),
    direction,
    context.orientation
  );

  const selectableCollection = createSelectableCollection(
    {
      selectionManager: () => context.listState().selectionManager(),
      keyboardDelegate: () => delegate,
      selectOnFocus: () => context.activationMode() === "automatic",
      shouldFocusWrap: false, // handled by the keyboard delegate
      disallowEmptySelection: true,
    },
    () => ref
  );

  createEffect(() => {
    if (ref == null) {
      return;
    }

    const selectedTab = ref.querySelector(
      `[data-key="${context.listState().selectedKey()}"]`
    ) as HTMLElement | null;

    if (selectedTab != null) {
      context.setSelectedTab(selectedTab);
    }
  });

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(el => (ref = el), local.ref)}
      role="tablist"
      aria-orientation={context.orientation()}
      data-orientation={context.orientation()}
      onKeyDown={composeEventHandlers([local.onKeyDown, selectableCollection.onKeyDown])}
      onMouseDown={composeEventHandlers([local.onMouseDown, selectableCollection.onMouseDown])}
      onFocusIn={composeEventHandlers([local.onFocusIn, selectableCollection.onFocusIn])}
      onFocusOut={composeEventHandlers([local.onFocusOut, selectableCollection.onFocusOut])}
      {...others}
    />
  );
}
