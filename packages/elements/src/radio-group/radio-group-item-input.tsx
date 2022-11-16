import {
  createPolymorphicComponent,
  mergeDefaultProps,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export interface RadioGroupItemInputProps {
  /** The HTML style attribute (only object form supported). */
  style?: JSX.CSSProperties;
}

/**
 * The native html input that is visually hidden in each radio item.
 */
export const RadioGroupItemInput = createPolymorphicComponent<"input", RadioGroupItemInputProps>(
  props => {
    props = mergeDefaultProps({ as: "input" }, props);

    const [local, others] = splitProps(props, ["as", "style"]);

    return (
      <Dynamic
        component={local.as}
        type="radio"
        data-part="item-input"
        style={{ ...visuallyHiddenStyles, ...local.style }}
        {...others}
      />
    );
  }
);
