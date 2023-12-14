import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useMenuItemContext } from "./menu-item.context";

export interface MenuItemIndicatorOptions extends AsChildProp {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

export interface MenuItemIndicatorProps
  extends OverrideComponentProps<"div", MenuItemIndicatorOptions> {}

/**
 * The visual indicator rendered when the parent menu `CheckboxItem` or `RadioItem` is checked.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function MenuItemIndicator(props: MenuItemIndicatorProps) {
  const context = useMenuItemContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("indicator"),
    },
    props
  );

  const [local, others] = splitProps(props, ["forceMount"]);

  return (
    <Show when={local.forceMount || context.isChecked()}>
      <Polymorphic as="div" {...context.dataset()} {...others} />
    </Show>
  );
}
