import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useProgressContext } from "./progress-context";

/**
 * The component that visually represents the progress track.
 * Act as a container for `Progress.Fill`.
 */
export const ProgressTrack = createPolymorphicComponent<"div">(props => {
  const context = useProgressContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
