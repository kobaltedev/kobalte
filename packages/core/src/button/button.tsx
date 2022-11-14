import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";

import { Pressable, PressableProps } from "../pressable";
import { createTagName } from "../primitives";
import { isButton } from "./is-button";

export interface ButtonProps extends PressableProps {
  /** Whether the button is disabled. */
  disabled?: boolean;
}

/**
 * Button enables users to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.
 This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export const Button = createPolymorphicComponent<"button", ButtonProps>(props => {
  let ref: HTMLButtonElement | undefined;

  props = mergeDefaultProps({ as: "button" }, props);

  const [local, others] = splitProps(props, ["ref", "disabled"]);

  const tagName = createTagName(
    () => ref,
    () => "button"
  );

  const isNativeButton = createMemo(() => {
    const _tagName = tagName();
    return !!_tagName && isButton({ tagName: _tagName, type: props.type });
  });

  const isLink = createMemo(() => {
    return tagName() === "a" && (props as any).href != null;
  });

  const isInput = createMemo(() => {
    return tagName() === "input";
  });

  return (
    <Pressable
      ref={mergeRefs(el => (ref = el), local.ref)}
      type={isNativeButton() && !isInput() ? "button" : undefined}
      role={!isNativeButton() && !isLink() ? "button" : undefined}
      tabIndex={!isNativeButton() && !isLink() && !local.disabled ? 0 : undefined}
      disabled={isNativeButton() || isInput() ? local.disabled : undefined}
      aria-disabled={!isNativeButton() && !isInput() && local.disabled ? true : undefined}
      {...others}
    />
  );
});
