import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useSwitchContext } from "./switch-context";

/**
 * The thumb that is used to visually indicate whether the switch is on or off.
 */
export function SwitchThumb(props: ComponentProps<"div">) {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("thumb"),
    },
    props
  );

  return <Polymorphic fallback="div" {...context.dataset()} {...props} />;
}
