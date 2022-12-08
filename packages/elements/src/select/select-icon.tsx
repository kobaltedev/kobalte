import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext } from "../dialog";

/**
 * A small icon often displayed next to the value as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon `children`.
 */
export const SelectIcon = createPolymorphicComponent<"div">(props => {
  const dialogContext = useDialogContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Dynamic component={local.as} aria-hidden="true" {...dialogContext.dataset()} {...others}>
      ▼
    </Dynamic>
  );
});
