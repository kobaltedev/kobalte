import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createFocusTrapRegion, createOverlay } from "../primitives";
import { usePopoverContext } from "./popover-context";

export interface PopoverContentProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * Contains the content to be rendered when the popover is open.
 */
export const PopoverContent = createPolymorphicComponent<"div", PopoverContentProps>(props => {
  let ref: HTMLDivElement | undefined;

  const context = usePopoverContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("content"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref", "id", "style", "onKeyDown"]);

  const { overlayHandlers } = createOverlay(context.createOverlayProps, () => ref);

  const { FocusTrap } = createFocusTrapRegion(context.createFocusTrapRegionProps, () => ref);

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);
    callHandler(e, overlayHandlers.onKeyDown);
  };

  createEffect(() => onCleanup(context.registerContentId(local.id!)));

  return (
    <Show when={context.shouldMount()}>
      <FocusTrap />
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => {
          context.setContentRef(el);
          ref = el;
        }, local.ref)}
        role="dialog"
        id={local.id}
        tabIndex={-1}
        style={{ position: "relative", ...local.style }}
        aria-labelledby={context.titleId()}
        aria-describedby={context.descriptionId()}
        onKeyDown={onKeyDown}
        {...others}
      />
      <FocusTrap />
    </Show>
  );
});
