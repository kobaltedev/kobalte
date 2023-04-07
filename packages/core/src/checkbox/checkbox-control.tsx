import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useCheckboxContext } from "./checkbox-context";

export interface CheckboxControlProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The element that visually represents a checkbox.
 */
export function CheckboxControl(props: CheckboxControlProps) {
  const context = useCheckboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props
  );

  return <Polymorphic as="div" {...context.dataset()} {...props} />;
}
