/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTabPanel.ts
 */

import {
  combineProps,
  createPolymorphicComponent,
  getFocusableTreeWalker,
  mergeDefaultProps,
} from "@kobalte/utils";
import { createEffect, createSignal, on, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createFocusRing } from "../primitives";
import { useTabsContext } from "./tabs-context";

export interface TabsContentProps {
  /** The unique key that associates the tab panel with a tab. */
  value: string;

  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * Contains the content associated with a tab trigger.
 */
export const TabsContent = createPolymorphicComponent<"div", TabsContentProps>(props => {
  let ref!: HTMLElement;

  const context = useTabsContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "id", "value", "forceMount"]);

  const [tabIndex, setTabIndex] = createSignal<number | undefined>(0);

  const id = () => local.id ?? context.generateContentId(local.value);

  const isSelected = () => context.listState().selectedKey() === local.value;
  const shouldMount = () => local.forceMount || isSelected();

  const updateTabIndex = () => {
    if (ref == null || !shouldMount()) {
      return;
    }

    // Detect if there are any tabbable elements and update the tabIndex accordingly.
    const walker = getFocusableTreeWalker(ref, { tabbable: true });
    setTabIndex(walker.nextNode() ? undefined : 0);
  };

  const observer = new MutationObserver(updateTabIndex);

  const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing();

  createEffect(
    on([() => ref, shouldMount], ([ref, shouldMount]) => {
      if (ref == null || !shouldMount) {
        return;
      }

      updateTabIndex();

      // Update when new elements are inserted, or the tabIndex/disabled attribute updates.
      observer.observe(ref, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["tabIndex", "disabled"],
      });

      onCleanup(() => {
        observer.disconnect();
      });
    })
  );

  createEffect(
    on([() => local.value, id], ([value, id]) => {
      context.contentIdsMap().set(value, id);
    })
  );

  return (
    <Show when={shouldMount()}>
      <Dynamic
        component={local.as}
        id={id()}
        role="tabpanel"
        tabIndex={tabIndex()}
        aria-labelledby={context.triggerIdsMap().get(local.value)}
        data-orientation={context.orientation()}
        data-focus={isFocused() ? "" : undefined}
        data-focus-visible={isFocusVisible() ? "" : undefined}
        {...combineProps({ ref: el => (ref = el) }, others, focusRingHandlers)}
      />
    </Show>
  );
});
