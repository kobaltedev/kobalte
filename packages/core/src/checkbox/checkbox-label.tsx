import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic/index.js";
import { useCheckboxContext } from "./checkbox-context.js";

export interface CheckboxLabelProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * The label that gives the user information on the checkbox.
 */
export function CheckboxLabel(props: CheckboxLabelProps) {
  const context = useCheckboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  return <Polymorphic as="span" {...context.dataset()} {...props} />;
}
