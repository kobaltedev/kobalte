import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useRadioGroupItemContext } from "./radio-group-item-context";

/**
 * The label that gives the user information on the radio button.
 */
export function RadioGroupItemLabel(props: ComponentProps<"span">) {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  return <Polymorphic fallback="span" {...context.dataset()} {...props} />;
}
