import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useSelectContext } from "./select-context";

/**
 * A small icon often displayed next to the value as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon `children`.
 */
export function SelectIcon(props: ComponentProps<"div">) {
  const context = useSelectContext();

  props = mergeDefaultProps({ children: "▼" }, props);

  return (
    <Polymorphic
      fallback="div"
      aria-hidden="true"
      data-expanded={context.isOpen() ? "" : undefined}
      data-closed={!context.isOpen() ? "" : undefined}
      {...props}
    />
  );
}
