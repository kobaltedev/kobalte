import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useSwitchContext } from "./switch-context";

/**
 * The label that gives the user information on the switch.
 */
export function SwitchLabel(props: ComponentProps<"span">) {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  return <Polymorphic fallback="span" {...context.dataset()} {...props} />;
}
