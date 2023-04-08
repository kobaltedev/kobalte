import { isFunction, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, children, JSX, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxControlBaseState {
  /** The selected values. */
  values: Accessor<string[]>;

  /** A function to remove a value from the selection. */
  remove: (value: string) => void;

  /** A function to clear the selection. */
  clear: () => void;
}

export interface ComboboxControlBaseOptions {
  /**
   * The children of the combobox control.
   * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
   */
  children?: JSX.Element | ((state: ComboboxControlBaseState) => JSX.Element);
}

export interface ComboboxControlBaseProps
  extends OverrideComponentProps<"div", ComboboxControlBaseOptions> {}

/**
 * Contains the combobox input and trigger.
 */
export function ComboboxControlBase(props: ComboboxControlBaseProps) {
  const formControlContext = useFormControlContext();
  const context = useComboboxContext();

  const [local, others] = splitProps(props, ["ref", "children"]);

  const selectionManager = () => context.listState().selectionManager();

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(context.setControlRef, local.ref)}
      {...context.dataset()}
      {...formControlContext.dataset()}
      {...others}
    >
      <ComboboxControlBaseChild
        state={{
          values: () => [...selectionManager().selectedKeys()],
          remove: value => selectionManager().toggleSelection(value),
          clear: () => selectionManager().clearSelection(),
        }}
        children={local.children}
      />
    </Polymorphic>
  );
}

interface ComboboxControlBaseChildProps extends Pick<ComboboxControlBaseOptions, "children"> {
  state: ComboboxControlBaseState;
}

function ComboboxControlBaseChild(props: ComboboxControlBaseChildProps) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });

  return <>{resolvedChildren()}</>;
}
