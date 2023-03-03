import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useCheckboxContext } from "./checkbox-context";

/**
 * The element that visually represents a checkbox.
 */
export function CheckboxControl(props: ComponentProps<"div">) {
  const context = useCheckboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props
  );

  return <Polymorphic fallback="div" {...context.dataset()} {...props} />;
}
