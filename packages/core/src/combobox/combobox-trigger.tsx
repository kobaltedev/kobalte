import { isFunction, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, children, JSX, splitProps } from "solid-js";

import { MultiComboboxTrigger } from "../multi-combobox/multi-combobox-trigger";

export interface ComboboxTriggerState {
  /** The selected value. */
  value: Accessor<string>;

  /** A function to clear the selection. */
  clear: () => void;
}

export interface ComboboxTriggerOptions {
  /**
   * The children of the combobox trigger.
   * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
   */
  children?: JSX.Element | ((state: ComboboxTriggerState) => JSX.Element);
}

export interface ComboboxTriggerProps
  extends OverrideComponentProps<"div", ComboboxTriggerOptions> {}

/**
 * Contains the combobox input and button.
 */
export function ComboboxTrigger(props: ComboboxTriggerProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <MultiComboboxTrigger {...others}>
      {state => (
        <ComboboxTriggerChild
          state={{
            value: () => state.values()[0],
            clear: () => state.clear(),
          }}
          children={local.children}
        />
      )}
    </MultiComboboxTrigger>
  );
}

interface ComboboxTriggerChildProps extends Pick<ComboboxTriggerOptions, "children"> {
  state: ComboboxTriggerState;
}

function ComboboxTriggerChild(props: ComboboxTriggerChildProps) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });

  return <>{resolvedChildren()}</>;
}
