import { isFunction, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, children, createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { useSelectContext } from "./select-context";

export interface SelectValueState<T> {
  /** The first (or only, in case of single select) selected option. */
  selectedOption: Accessor<T>;

  /** An array of selected options. It will contain only one value in case of single select. */
  selectedOptions: Accessor<T[]>;

  /** A function to remove an option from the selection. */
  remove: (option: T) => void;

  /** A function to clear the selection. */
  clear: () => void;
}

export interface SelectValueOptions<T> {
  /**
   * The children of the select value.
   * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
   */
  children?: JSX.Element | ((state: SelectValueState<T>) => JSX.Element);
}

export interface SelectValueProps<T>
  extends OverrideComponentProps<"span", SelectValueOptions<T>> {}

/**
 * The part that reflects the selected value(s).
 */
export function SelectValue<T>(props: SelectValueProps<T>) {
  const formControlContext = useFormControlContext();
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("value"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "children"]);

  const selectionManager = () => context.listState().selectionManager();

  const isSelectionEmpty = () => {
    const selectedKeys = selectionManager().selectedKeys();

    // Some form libraries uses an empty string as default value, often taken from an empty `<option />`.
    // Ignore since it is not a valid key.
    if (selectedKeys.size === 1 && selectedKeys.has("")) {
      return true;
    }

    return selectionManager().isEmpty();
  };

  createEffect(() => onCleanup(context.registerValueId(local.id!)));
  return (
    <span
      id={local.id}
      data-placeholder-shown={isSelectionEmpty() ? "" : undefined}
      {...formControlContext.dataset()}
      {...others}
    >
      <Show when={!isSelectionEmpty()} fallback={context.placeholder()}>
        <SelectValueChild
          state={{
            selectedOption: () => context.selectedOptions()[0],
            selectedOptions: () => context.selectedOptions(),
            remove: option => context.removeOptionFromSelection(option),
            clear: () => selectionManager().clearSelection(),
          }}
          children={local.children}
        />
      </Show>
    </span>
  );
}

interface SelectValueChildProps<T> extends Pick<SelectValueOptions<T>, "children"> {
  state: SelectValueState<T>;
}

function SelectValueChild<T>(props: SelectValueChildProps<T>) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });

  return <>{resolvedChildren()}</>;
}
