import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";

import { PopperPositioner, PopperPositionerProps } from "../popper/popper-positioner";
import { useMenuContext } from "./menu-context";

/**
 * A wrapper component to help positioning the menu content on screen.
 */
export const MenuPositioner = createPolymorphicComponent<"div", PopperPositionerProps>(props => {
  const context = useMenuContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["style"]);

  return (
    <Show when={context.shouldMount()}>
      <PopperPositioner
        // We re-enable pointer-events prevented by `Menu.Content` to allow scrolling.
        style={{ "pointer-events": "auto", ...local.style }}
        {...others}
      />
    </Show>
  );
});
