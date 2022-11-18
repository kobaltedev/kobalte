import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioContext } from "./radio-context";

/**
 * A visual indicator rendered when the radio button is in a checked state.
 */
export const RadioIndicator = createPolymorphicComponent<"div">(props => {
  const context = useRadioContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Show when={context.isSelected()}>
      <Dynamic component={local.as} data-part="indicator" {...context.dataset()} {...others} />
    </Show>
  );
});
