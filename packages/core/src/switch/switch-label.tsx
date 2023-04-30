import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic/index.js";
import { useSwitchContext } from "./switch-context.js";

export interface SwitchLabelProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * The label that gives the user information on the switch.
 */
export function SwitchLabel(props: SwitchLabelProps) {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  return <Polymorphic as="span" {...context.dataset()} {...props} />;
}
