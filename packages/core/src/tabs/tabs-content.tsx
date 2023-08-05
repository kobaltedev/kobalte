/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTabPanel.ts
 */

import { getFocusableTreeWalker, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, createSignal, on, onCleanup, Show, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { createPresence } from "../primitives";
import { useTabsContext } from "./tabs-context";

export interface TabsContentOptions extends AsChildProp {
  /** The unique key that associates the tab panel with a tab. */
  value: string;

  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

export interface TabsContentProps extends OverrideComponentProps<"div", TabsContentOptions> {}

/**
 * Contains the content associated with a tab trigger.
 */
export function TabsContent(props: TabsContentProps) {
  let ref!: HTMLElement;

  const context = useTabsContext();

  const [local, others] = splitProps(props, ["ref", "id", "value", "forceMount"]);

  const [tabIndex, setTabIndex] = createSignal<number | undefined>(0);

  const id = () => local.id ?? context.generateContentId(local.value);

  const isSelected = () => context.listState().selectedKey() === local.value;

  const presence = createPresence(() => local.forceMount || isSelected());

  createEffect(
    on([() => ref, () => presence.isPresent()], ([ref, isPresent]) => {
      if (ref == null || !isPresent) {
        return;
      }

      const updateTabIndex = () => {
        // Detect if there are any tabbable elements and update the tabIndex accordingly.
        const walker = getFocusableTreeWalker(ref, { tabbable: true });
        setTabIndex(walker.nextNode() ? undefined : 0);
      };

      updateTabIndex();

      const observer = new MutationObserver(updateTabIndex);

      // Update when new elements are inserted, or the tabindex/disabled attribute updates.
      observer.observe(ref, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["tabindex", "disabled"],
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
    <Show when={presence.isPresent()}>
      <Polymorphic
        as="div"
        ref={mergeRefs(el => {
          presence.setRef(el);
          ref = el;
        }, local.ref)}
        id={id()}
        role="tabpanel"
        tabIndex={tabIndex()}
        aria-labelledby={context.triggerIdsMap().get(local.value)}
        data-orientation={context.orientation()}
        data-selected={isSelected() ? "" : undefined}
        {...others}
      />
    </Show>
  );
}
