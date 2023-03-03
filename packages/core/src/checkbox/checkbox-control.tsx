import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useCheckboxContext } from "./checkbox-context";

/**
 * The element that visually represents a checkbox.
 */
export function CheckboxControl(props: OverrideComponentProps<"div", AsChildProp>) {
  const context = useCheckboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props
  );

  return <Polymorphic fallback="div" {...context.dataset()} {...props} />;
}
