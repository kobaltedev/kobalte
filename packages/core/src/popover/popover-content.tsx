import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { FocusScope } from "../focus-scope";

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

  const [local, others] = splitProps(props, ["as", "ref", "id", "style"]);

  createEffect(() => onCleanup(context.registerContentId(local.id!)));

  // TODO: restore focus not working correctly (modal, non modal)
  return (
    <FocusScope
      trapFocus={context.trapFocus()}
      autoFocus={context.autoFocus()}
      restoreFocus={context.restoreFocus()}
    >
      {setContainerRef => (
        <Dynamic
          component={local.as}
          ref={mergeRefs(el => {
            context.setContentRef(el);
            setContainerRef(el);
          }, local.ref)}
          id={local.id}
          role="dialog"
          tabIndex={-1}
          style={{ position: "relative", ...local.style }}
          aria-labelledby={context.titleId()}
          aria-describedby={context.descriptionId()}
          {...others}
        />
      )}
    </FocusScope>
  );
});
