import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useMenuItemContext } from "./menu-item.context";

export interface MenuItemIndicatorProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The visual indicator rendered when the menu item radio/checkbox is in a checked state.
 */
export const MenuItemIndicator = createPolymorphicComponent<"div", MenuItemIndicatorProps>(
  props => {
    const context = useMenuItemContext();

    props = mergeDefaultProps(
      {
        as: "div",
        id: context.generateId("indicator"),
      },
      props
    );

    const [local, others] = splitProps(props, ["as", "forceMount"]);

    return (
      <Show when={local.forceMount || context.isChecked()}>
        <Dynamic component={local.as} {...context.dataset()} {...others} />
      </Show>
    );
  }
);
