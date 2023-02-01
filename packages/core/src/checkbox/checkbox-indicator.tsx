import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCheckboxContext } from "./checkbox-context";
import { createPresence } from "../primitives";

export interface CheckboxIndicatorOptions {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The visual indicator rendered when the checkbox is in a checked or indeterminate state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export const CheckboxIndicator = createPolymorphicComponent<"div", CheckboxIndicatorOptions>(
  props => {
    const context = useCheckboxContext();

    props = mergeDefaultProps(
      {
        as: "div",
        id: context.generateId("indicator"),
      },
      props
    );

    const [local, others] = splitProps(props, ["as", "ref", "forceMount"]);

    const presence = createPresence(
      () => local.forceMount || context.isIndeterminate() || context.isChecked()
    );

    return (
      <Show when={presence.isPresent()}>
        <Dynamic
          component={local.as}
          ref={mergeRefs(presence.setRef, local.ref)}
          {...context.dataset()}
          {...others}
        />
      </Show>
    );
  }
);
