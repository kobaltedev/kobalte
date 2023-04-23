import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxIconProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * A small icon often displayed next to the value as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon `children`.
 */
export function ComboboxIcon(props: ComboboxIconProps) {
  const context = useComboboxContext();

  props = mergeDefaultProps({ children: "▼" }, props);

  return <Polymorphic as="span" aria-hidden="true" {...context.dataset()} {...props} />;
}
