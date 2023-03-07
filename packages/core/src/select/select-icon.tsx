import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSelectContext } from "./select-context";

/**
 * A small icon often displayed next to the value as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon `children`.
 */
export function SelectIcon(props: OverrideComponentProps<"div", AsChildProp>) {
  const context = useSelectContext();

  props = mergeDefaultProps({ children: "▼" }, props);

  return <Polymorphic fallback="div" aria-hidden="true" {...context.dataset()} {...props} />;
}
