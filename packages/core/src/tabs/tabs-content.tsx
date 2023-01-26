/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTabPanel.ts
 */

import {
  composeEventHandlers,
  createPolymorphicComponent,
  getFocusableTreeWalker,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, createSignal, on, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createFocusRing, FOCUS_RING_HANDLERS_PROP_NAMES } from "../primitives";
import { useTabsContext } from "./tabs-context";

export interface TabsContentOptions {
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
export const TabsContent = /*#__PURE__*/ createPolymorphicComponent<"div", TabsContentOptions>(
  props => {
    let ref!: HTMLElement;

    const context = useTabsContext();

    props = mergeDefaultProps({ as: "div" }, props);

    const [local, others] = splitProps(props, [
      "as",
      "ref",
      "id",
      "value",
      "forceMount",
      ...FOCUS_RING_HANDLERS_PROP_NAMES,
    ]);

    const [tabIndex, setTabIndex] = createSignal<number | undefined>(0);

    const id = () => local.id ?? context.generateContentId(local.value);

    const isSelected = () => context.listState().selectedKey() === local.value;
    const shouldMount = () => local.forceMount || isSelected();

    const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing();

    createEffect(
      on([() => ref, shouldMount], ([ref, shouldMount]) => {
        if (ref == null || !shouldMount) {
          return;
        }

        const updateTabIndex = () => {
          // Detect if there are any tabbable elements and update the tabIndex accordingly.
          const walker = getFocusableTreeWalker(ref, { tabbable: true });
          setTabIndex(walker.nextNode() ? undefined : 0);
        };

        updateTabIndex();

        const observer = new MutationObserver(updateTabIndex);

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
          ref={mergeRefs(el => (ref = el), local.ref)}
          id={id()}
          role="tabpanel"
          tabIndex={tabIndex()}
          aria-labelledby={context.triggerIdsMap().get(local.value)}
          data-orientation={context.orientation()}
          data-focus={isFocused() ? "" : undefined}
          data-focus-visible={isFocusVisible() ? "" : undefined}
          onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
          onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
          {...others}
        />
      </Show>
    );
  }
);
