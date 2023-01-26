import { createPolymorphicComponent, isFunction, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, children, createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useFormControlContext } from "../form-control";
import { useSelectContext } from "./select-context";

interface SelectValueState {
  /** The selected value of the select. */
  selectedValue: Accessor<string>;
}

export interface SelectValueOptions {
  /** The content that will be rendered when no value or defaultValue is set. */
  placeholder?: JSX.Element;

  /** The content that will be rendered when a value is set. */
  children?: ((state: SelectValueState) => JSX.Element) | JSX.Element;
}

/**
 * The part that reflects the selected value. By default, the selected item's text will be rendered.
 * If you require more control, you can instead control the select and pass your own children.
 * An optional placeholder prop is also available for when the select has no value.
 */
export const SelectValue = /*#__PURE__*/ createPolymorphicComponent<"span", SelectValueOptions>(
  props => {
    const formControlContext = useFormControlContext();
    const context = useSelectContext();

    props = mergeDefaultProps({ as: "span", id: context.generateId("value") }, props);

    const [local, others] = splitProps(props, ["as", "id", "children", "placeholder"]);

    const selectionManager = () => context.listState().selectionManager();
    const isSelectionEmpty = () => selectionManager().isEmpty();

    const valueLabels = () => {
      return [...selectionManager().selectedKeys()]
        .map(key => context.listState().collection().getItem(key)?.label ?? key)
        .join(", ");
    };

    createEffect(() => onCleanup(context.registerValueId(local.id!)));

    return (
      <Dynamic
        component={local.as}
        id={local.id}
        data-placeholder-shown={isSelectionEmpty() ? "" : undefined}
        {...formControlContext.dataset()}
        {...others}
      >
        <Show when={!isSelectionEmpty()} fallback={local.placeholder}>
          <Show when={local.children} fallback={valueLabels()}>
            <SelectValueChild
              state={{
                selectedValue: () => selectionManager().selectedKeys().values().next().value,
              }}
              children={local.children}
            />
          </Show>
        </Show>
      </Dynamic>
    );
  }
);

interface SelectValueChildProps extends Pick<SelectValueOptions, "children"> {
  state: SelectValueState;
}

function SelectValueChild(props: SelectValueChildProps) {
  return children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });
}
