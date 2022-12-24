import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { FocusScope } from "../focus-scope";
import { Overlay } from "../overlay";
import { usePopoverContext } from "./popover-context";

export interface PopoverContentProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * Contains the content to be rendered when the popover is open.
 */
export const PopoverContent = createPolymorphicComponent<"div", PopoverContentProps>(props => {
  const context = usePopoverContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("content"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id", "style"]);

  createEffect(() => onCleanup(context.registerContentId(local.id!)));

  return (
    <Show when={context.shouldMount()}>
      <FocusScope trapFocus={context.isOpen() && context.isModal()} autoFocus restoreFocus>
        {setContainerRef => (
          <Overlay
            ref={mergeRefs(el => {
              context.setContentRef(el);
              setContainerRef(el);
            }, local.ref)}
            role="dialog"
            id={local.id}
            tabIndex={-1}
            style={{ position: "relative", ...local.style }}
            isOpen={context.isOpen()}
            isModal={context.isModal()}
            closeOnEsc={context.closeOnEsc()}
            closeOnInteractOutside={context.closeOnInteractOutside()}
            shouldCloseOnInteractOutside={context.shouldCloseOnInteractOutside}
            onClose={context.close}
            aria-labelledby={context.titleId()}
            aria-describedby={context.descriptionId()}
            {...others}
          />
        )}
      </FocusScope>
    </Show>
  );
});
