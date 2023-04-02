import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useRadioGroupItemContext } from "./radio-group-item-context";

export interface RadioGroupItemLabelProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * The label that gives the user information on the radio button.
 */
export function RadioGroupItemLabel(props: RadioGroupItemLabelProps) {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  return <Polymorphic as="span" {...context.dataset()} {...props} />;
}
