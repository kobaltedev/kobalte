import { isFunction, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, children, JSX, splitProps } from "solid-js";

import { ComboboxControlBase } from "./combobox-control-base";

export interface ComboboxControlState {
  /** The selected value. */
  value: Accessor<string>;

  /** A function to clear the selection. */
  clear: () => void;
}

export interface ComboboxControlOptions {
  /**
   * The children of the combobox control.
   * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
   */
  children?: JSX.Element | ((state: ComboboxControlState) => JSX.Element);
}

export interface ComboboxControlProps
  extends OverrideComponentProps<"div", ComboboxControlOptions> {}

/**
 * Contains the combobox input and trigger.
 */
export function ComboboxControl(props: ComboboxControlProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <ComboboxControlBase {...others}>
      {state => (
        <ComboboxControlChild
          state={{
            value: () => state.values()[0],
            clear: () => state.clear(),
          }}
          children={local.children}
        />
      )}
    </ComboboxControlBase>
  );
}

interface ComboboxControlChildProps extends Pick<ComboboxControlOptions, "children"> {
  state: ComboboxControlState;
}

function ComboboxControlChild(props: ComboboxControlChildProps) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });

  return <>{resolvedChildren()}</>;
}
