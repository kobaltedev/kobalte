import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createPress, CreatePressProps } from "../primitives";

export interface PressableProps extends CreatePressProps {}

/**
 * `Pressable` handles press interactions across mouse, touch, keyboard, and screen readers.
 * It normalizes behavior across browsers and platforms, and handles many nuances of dealing with pointer and keyboard events.
 * It renders a `<button>` by default.
 */
export const Pressable = createPolymorphicComponent<"button", PressableProps>(props => {
  props = mergeDefaultProps({ as: "button" }, props);

  const [local, others] = splitProps(props, ["as"]);

  const { isPressed, pressProps } = createPress<HTMLButtonElement>(others);

  return <Dynamic component={local.as} data-pressed={isPressed()} {...pressProps} />;
});
