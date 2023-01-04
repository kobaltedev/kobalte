import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useMenuContext } from "./menu-context";

/**
 * A small icon often displayed inside the menu trigger as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon by providing a `children`.
 */
export const MenuIcon = createPolymorphicComponent<"div">(props => {
  const context = useMenuContext();

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
