import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSelectContext } from "./select-context";

/**
 * A small icon often displayed next to the value as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon `children`.
 */
export const SelectIcon = /*#__PURE__*/ createPolymorphicComponent<"div">(props => {
  const context = useSelectContext();

  props = mergeDefaultProps({ as: "div", children: "▼" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Dynamic
      component={local.as}
      aria-hidden="true"
      data-expanded={context.isOpen() ? "" : undefined}
      {...others}
    />
  );
});
