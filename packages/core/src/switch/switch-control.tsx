import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSwitchContext } from "./switch-context";

/**
 * The element that visually represents a switch.
 */
export const SwitchControl = /*#__PURE__*/ createPolymorphicComponent<"div">(props => {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("control"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
