/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */

import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
  createEffect,
  createSignal,
  JSX,
  on,
  onCleanup,
  onMount,
  Show,
  splitProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";

import { createPresence } from "../primitives";
import { useCollapsibleContext } from "./collapsible-context";

export interface CollapsibleContentOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * Contains the content to be rendered when the collapsible is expanded.
 */
export const CollapsibleContent = createPolymorphicComponent<"div", CollapsibleContentOptions>(
  props => {
    let ref: HTMLDivElement | undefined;

    const context = useCollapsibleContext();

    props = mergeDefaultProps(
      {
        as: "div",
        id: context.generateId("content"),
      },
      props
    );

    const [local, others] = splitProps(props, ["as", "ref", "id", "style", "children"]);

    const presence = createPresence(() => context.shouldMount());

    const [height, setHeight] = createSignal(0);
    const [width, setWidth] = createSignal(0);

    // when opening we want it to immediately open to retrieve dimensions
    // when closing we delay `isPresent` to retrieve dimensions before closing
    const isOpen = () => context.isOpen() || presence.isPresent();

    let isMountAnimationPrevented = isOpen();
    let originalStyles: Record<string, string> | undefined;

    createEffect(() => onCleanup(context.registerContentId(local.id!)));

    createEffect(
      on(
        /**
         * depends on `context.isOpen` because it will change to `false`
         * when a close is triggered but `isPresent` will be `false` on
         * animation end (so when close finishes). This allows us to
         * retrieve the dimensions *before* closing.
         */
        [() => context.isOpen(), () => presence.isPresent()],
        () => {
          if (!ref) {
            return;
          }

          originalStyles = originalStyles || {
            transitionDuration: ref.style.transitionDuration,
            animationName: ref.style.animationName,
          };

          // block any animations/transitions so the element renders at its full dimensions
          ref.style.transitionDuration = "0s";
          ref.style.animationName = "none";

          // get width and height from full dimensions
          const rect = ref.getBoundingClientRect();
          setHeight(rect.height);
          setWidth(rect.width);

          // kick off any animations/transitions that were originally set up if it isn't the initial mount
          if (!isMountAnimationPrevented) {
            ref.style.transitionDuration = originalStyles.transitionDuration;
            ref.style.animationName = originalStyles.animationName;
          }
        }
      )
    );

    onMount(() => {
      const raf = requestAnimationFrame(() => {
        isMountAnimationPrevented = false;
      });

      onCleanup(() => {
        cancelAnimationFrame(raf);
      });
    });

    return (
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => {
          ref = el;
          presence.setRef(el);
        }, local.ref)}
        id={local.id}
        hidden={!isOpen()}
        style={{
          "--kb-collapsible-content-height": height() ? `${height()}px` : undefined,
          "--kb-collapsible-content-width": width() ? `${width()}px` : undefined,
          ...local.style,
        }}
        data-expanded={context.isOpen() ? "" : undefined}
        {...others}
      >
        <Show when={isOpen()}>{local.children}</Show>
      </Dynamic>
    );
  }
);
