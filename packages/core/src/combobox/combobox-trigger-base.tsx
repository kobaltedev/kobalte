import { isFunction, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, children, JSX, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxTriggerBaseState {
  /** The selected values. */
  values: Accessor<string[]>;

  /** A function to remove a value from the selection. */
  remove: (value: string) => void;

  /** A function to clear the selection. */
  clear: () => void;
}

export interface ComboboxTriggerBaseOptions {
  /**
   * The children of the combobox trigger.
   * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
   */
  children?: JSX.Element | ((state: ComboboxTriggerBaseState) => JSX.Element);
}

export interface ComboboxTriggerBaseProps
  extends OverrideComponentProps<"div", ComboboxTriggerBaseOptions> {}

/**
 * Contains the combobox input and button.
 */
export function ComboboxTriggerBase(props: ComboboxTriggerBaseProps) {
  const formControlContext = useFormControlContext();
  const context = useComboboxContext();

  const [local, others] = splitProps(props, ["ref", "children"]);

  const selectionManager = () => context.listState().selectionManager();

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      {...context.dataset()}
      {...formControlContext.dataset()}
      {...others}
    >
      <ComboboxTriggerBaseChild
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

interface ComboboxTriggerBaseChildProps extends Pick<ComboboxTriggerBaseOptions, "children"> {
  state: ComboboxTriggerBaseState;
}

function ComboboxTriggerBaseChild(props: ComboboxTriggerBaseChildProps) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });

  return <>{resolvedChildren()}</>;
}
