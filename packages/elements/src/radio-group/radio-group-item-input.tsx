import {
  createPolymorphicComponent,
  mergeDefaultProps,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupItemContext } from "./radio-group-item-context";

export interface RadioGroupItemInputProps {
  /** The HTML style attribute (only object form supported). */
  style?: JSX.CSSProperties;
}

/**
 * The native html input that is visually hidden in each radio item.
 */
export const RadioGroupItemInput = createPolymorphicComponent<"input", RadioGroupItemInputProps>(
  props => {
    const context = useRadioGroupItemContext();

    props = mergeDefaultProps({ as: "input" }, props);

    const [local, others] = splitProps(props, ["as", "style"]);

    return (
      <Dynamic
        component={local.as}
        type="radio"
        style={{ ...visuallyHiddenStyles, ...local.style }}
        data-part="item-input"
        data-focus={context.isFocused() ? "" : undefined}
        data-focus-visible={context.isFocusVisible() ? "" : undefined}
        {...others}
      />
    );
  }
);
