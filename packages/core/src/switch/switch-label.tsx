import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSwitchContext } from "./switch-context";

/**
 * The label that gives the user information on the switch.
 */
export function SwitchLabel(props: OverrideComponentProps<"span", AsChildProp>) {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  return <Polymorphic fallback="span" {...context.dataset()} {...props} />;
}
