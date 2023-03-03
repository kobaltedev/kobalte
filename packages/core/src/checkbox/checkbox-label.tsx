import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useCheckboxContext } from "./checkbox-context";

/**
 * The label that gives the user information on the checkbox.
 */
export function CheckboxLabel(props: OverrideComponentProps<"span", AsChildProp>) {
  const context = useCheckboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  return <Polymorphic fallback="span" {...context.dataset()} {...props} />;
}
