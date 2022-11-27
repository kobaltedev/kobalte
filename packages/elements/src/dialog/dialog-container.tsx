import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext } from "./dialog-context";

export interface DialogContainerProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * A container for the dialog panel. Useful for positioning the dialog panel on screen.
 */
export const DialogContainer = createPolymorphicComponent<"div", DialogContainerProps>(props => {
  const context = useDialogContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "forceMount"]);

  return (
    <Show when={local.forceMount || context.isOpen()}>
      <Dynamic component={local.as} {...context.dataset()} {...others} />
    </Show>
  );
});
