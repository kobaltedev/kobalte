import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic/index.js";
import { useSwitchContext } from "./switch-context.js";

export interface SwitchControlProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The element that visually represents a switch.
 */
export function SwitchControl(props: SwitchControlProps) {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props
  );

  return <Polymorphic as="div" {...context.dataset()} {...props} />;
}
