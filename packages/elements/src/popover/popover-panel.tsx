import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { Overlay } from "../overlay";
import { usePopoverContext } from "./popover-context";

export interface PopoverPanelProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The element that visually represents a popover.
 * Contains the content to be rendered when the popover is open.
 */
export const PopoverPanel = createPolymorphicComponent<"div", PopoverPanelProps>(props => {
  const context = usePopoverContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("panel"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id", "style", "forceMount"]);

  createEffect(() => onCleanup(context.registerPanel(local.id!)));

  return (
    <Show when={local.forceMount || context.isOpen()}>
      <Overlay
        ref={mergeRefs(context.setPanelRef, local.ref)}
        role="dialog"
        id={local.id}
        tabIndex={-1}
        isOpen={context.isOpen()}
        onClose={context.close}
        isModal={context.isModal()}
        preventScroll={context.preventScroll()}
        closeOnInteractOutside={context.closeOnInteractOutside()}
        closeOnEsc={context.closeOnEsc()}
        shouldCloseOnInteractOutside={context.shouldCloseOnInteractOutside}
        trapFocus={context.trapFocus()}
        autoFocus={context.autoFocus()}
        restoreFocus={context.restoreFocus()}
        initialFocusSelector={context.initialFocusSelector()}
        restoreFocusSelector={context.restoreFocusSelector()}
        aria-label={context.ariaLabel()}
        aria-labelledby={context.ariaLabel() ? undefined : context.ariaLabelledBy()}
        aria-describedby={context.ariaDescribedBy()}
        style={{ position: "relative", ...local.style }}
        {...context.dataset()}
        {...others}
      />
    </Show>
  );
});
