import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSwitchContext } from "./switch-context";

/**
 * The thumb that is used to visually indicate whether the switch is on or off.
 */
export const SwitchThumb = createPolymorphicComponent<"div">(props => {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("thumb"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
