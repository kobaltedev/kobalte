import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useCheckboxContext } from "./checkbox-context";

/**
 * The label that gives the user information on the checkbox.
 */
export function CheckboxLabel(props: ComponentProps<"span">) {
  const context = useCheckboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  return <Polymorphic fallback="span" {...context.dataset()} {...props} />;
}
