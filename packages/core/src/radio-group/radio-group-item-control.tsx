import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useRadioGroupItemContext } from "./radio-group-item-context";

/**
 * The element that visually represents a radio button.
 */
export function RadioGroupItemControl(props: ComponentProps<"div">) {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props
  );

  return <Polymorphic fallback="div" {...context.dataset()} {...props} />;
}
