import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSwitchContext } from "./switch-context";

/**
 * The thumb that is used to visually indicate whether the switch is on or off.
 */
export function SwitchThumb(props: OverrideComponentProps<"div", AsChildProp>) {
  const context = useSwitchContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("thumb"),
    },
    props
  );

  return <Polymorphic fallback="div" {...context.dataset()} {...props} />;
}
