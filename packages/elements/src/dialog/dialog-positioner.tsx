import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext, useDialogPortalContext } from "./dialog-context";

export interface DialogPositionerProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   * It inherits from `Dialog.Portal`.
   */
  forceMount?: boolean;
}

/**
 * A wrapper component to help positioning the dialog panel on screen.
 */
export const DialogPositioner = createPolymorphicComponent<"div", DialogPositionerProps>(props => {
  const context = useDialogContext();
  const portalContext = useDialogPortalContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "forceMount"]);

  return (
    <Show when={local.forceMount || portalContext?.forceMount() || context.isOpen()}>
      <Dynamic component={local.as} {...others} />
    </Show>
  );
});
