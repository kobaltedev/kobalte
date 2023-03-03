import { isFunction, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, children, createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { CollectionNode } from "../primitives";
import { useSelectContext } from "./select-context";

interface SelectValueState {
  /** The selected item of the select. */
  selectedItem: Accessor<CollectionNode>;
}

export interface SelectValueOptions extends AsChildProp {
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
export function SelectValue(props: OverrideComponentProps<"span", SelectValueOptions>) {
  const formControlContext = useFormControlContext();
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("value"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "children", "placeholder"]);

  const selectionManager = () => context.listState().selectionManager();
  const isSelectionEmpty = () => selectionManager().isEmpty();

  const selectedItem = () => {
    // Safe non-null assertion since it's used only when selection is not empty.
    return context
      .listState()
      .collection()
      .getItem(selectionManager().selectedKeys().values().next().value)!;
  };

  createEffect(() => onCleanup(context.registerValueId(local.id!)));

  return (
    <Polymorphic
      fallback="span"
      id={local.id}
      data-placeholder-shown={isSelectionEmpty() ? "" : undefined}
      {...formControlContext.dataset()}
      {...others}
    >
      <Show when={!isSelectionEmpty()} fallback={local.placeholder}>
        <SelectValueChild state={{ selectedItem }} children={local.children} />
      </Show>
    </Polymorphic>
  );
}

interface SelectValueChildProps extends Pick<SelectValueOptions, "children"> {
  state: SelectValueState;
}

function SelectValueChild(props: SelectValueChildProps) {
  return children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });
}
