import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic/index.js";
import { useRadioGroupItemContext } from "./radio-group-item-context.js";

export interface RadioGroupItemControlProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The element that visually represents a radio button.
 */
export function RadioGroupItemControl(props: RadioGroupItemControlProps) {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props
  );

  return <Polymorphic as="div" {...context.dataset()} {...props} />;
}
