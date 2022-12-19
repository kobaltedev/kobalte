import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCheckboxContext } from "./checkbox-context";

export interface CheckboxIndicatorProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The indicator that is used to visually indicate whether the checkbox is checked or not.
 */
export const CheckboxIndicator = createPolymorphicComponent<"div", CheckboxIndicatorProps>(
  props => {
    const context = useCheckboxContext();

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
