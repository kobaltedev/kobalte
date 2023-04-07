import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSwitchContext } from "./switch-context";

export interface SwitchThumbProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The thumb that is used to visually indicate whether the switch is on or off.
 */
export function SwitchThumb(props: SwitchThumbProps) {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("thumb"),
    },
    props
  );

  return <Polymorphic as="div" {...context.dataset()} {...props} />;
}
