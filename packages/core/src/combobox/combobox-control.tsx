import { isFunction, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, children, JSX, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxControlState<T> {
  /** The selected options. */
  selectedOptions: Accessor<T[]>;

  /** A function to remove an option from the selection. */
  remove: (option: T) => void;

  /** A function to clear the selection. */
  clear: () => void;
}

export interface ComboboxControlOptions<T> {
  /**
   * The children of the combobox control.
   * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
   */
  children?: JSX.Element | ((state: ComboboxControlState<T>) => JSX.Element);
}

export interface ComboboxControlProps<T>
  extends OverrideComponentProps<"div", ComboboxControlOptions<T>> {}

/**
 * Contains the combobox input and trigger.
 */
export function ComboboxControl<T>(props: ComboboxControlProps<T>) {
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
      <ComboboxControlChild
        state={{
          selectedOptions: () => context.selectedOptions(),
          remove: option => context.removeOptionFromSelection(option),
          clear: () => selectionManager().clearSelection(),
        }}
        children={local.children}
      />
    </Polymorphic>
  );
}

interface ComboboxControlChildProps<T> extends Pick<ComboboxControlOptions<T>, "children"> {
  state: ComboboxControlState<T>;
}

function ComboboxControlChild<T>(props: ComboboxControlChildProps<T>) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });

  return <>{resolvedChildren()}</>;
}
