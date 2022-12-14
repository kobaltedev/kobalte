import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext } from "./dialog-context";

/**
 * A wrapper component to help positioning the dialog panel on screen.
 */
export const DialogPositioner = createPolymorphicComponent<"div">(props => {
  const context = useDialogContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Show when={context.shouldMount()}>
      <Dynamic component={local.as} {...others} />
    </Show>
  );
});
