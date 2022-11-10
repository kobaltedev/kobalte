/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/icon/src/icon.tsx
 */

import { ElementType, isString } from "@kobalte/utils";
import { clsx } from "clsx";
import { ComponentProps, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createPolymorphicComponent, mergeDefaultProps } from "../utils";

const fallbackIcon = {
  viewBox: "0 0 24 24",
  path: () => (
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  ),
};

export type IconProps = ComponentProps<"svg">;

export const Icon = createPolymorphicComponent<"svg", IconProps>(props => {
  props = mergeDefaultProps(
    {
      children: fallbackIcon.path,
      viewBox: fallbackIcon.viewBox,
      color: "currentColor",
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "class", "children", "viewBox"]);

  const className = () => clsx("kb-icon", local.class);

  /**
   * If the `as` prop is a component (ex: if you're using an icon library).
   * Note: anyone passing the `as` prop, should manage the `viewBox` from the external component
   */
  const shouldRenderComponent = () => local.as && !isString(local.as);

  return (
    <Show
      when={shouldRenderComponent()}
      fallback={
        <svg viewBox={local.viewBox} class={className()} {...others}>
          {local.children}
        </svg>
      }
    >
      <Dynamic component={local.as as ElementType} class={className()} {...others} />
    </Show>
  );
});
