import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useSwitchContext } from "./switch-context";

/**
 * The element that visually represents a switch.
 */
export function SwitchControl(props: ComponentProps<"div">) {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props
  );

  return <Polymorphic fallback="div" {...context.dataset()} {...props} />;
}
