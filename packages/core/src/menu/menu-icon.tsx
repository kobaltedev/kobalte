import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useMenuContext } from "./menu-context";

/**
 * A small icon often displayed inside the menu trigger as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon by providing a `children`.
 */
export function MenuIcon(props: ComponentProps<"div">) {
  const context = useMenuContext();

  props = mergeDefaultProps({ children: "▼" }, props);

  return <Polymorphic fallback="div" aria-hidden="true" {...context.dataset()} {...props} />;
}
