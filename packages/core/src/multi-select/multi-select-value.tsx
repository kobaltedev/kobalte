import {
  createPolymorphicComponent,
  isFunction,
  mergeDefaultProps,
  OverrideComponentProps,
} from "@kobalte/utils";
import { Accessor, children, createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useFormControlContext } from "../form-control";
import { useSelectContext } from "../select/select-context";
import { CollectionNode } from "../primitives";
import { Polymorphic } from "../polymorphic";

interface MultiSelectValueState {
  /** The selected items of the multi-select. */
  selectedItems: Accessor<CollectionNode[]>;
}

export interface MultiSelectValueOptions {
  /** The content that will be rendered when no value or defaultValue is set. */
  placeholder?: JSX.Element;

  /** The content that will be rendered when a value is set. */
  children?: ((state: MultiSelectValueState) => JSX.Element) | JSX.Element;
}

/**
 * The part that reflects the selected value. By default, the selected item's text will be rendered.
 * If you require more control, you can instead control the select and pass your own children.
 * An optional placeholder prop is also available for when the select has no value.
 */
export function MultiSelectValue(props: OverrideComponentProps<"span", MultiSelectValueOptions>) {
  const formControlContext = useFormControlContext();
  const context = useSelectContext();

  props = mergeDefaultProps({ id: context.generateId("value") }, props);

  const [local, others] = splitProps(props, ["id", "children", "placeholder"]);

  const selectionManager = () => context.listState().selectionManager();
  const isSelectionEmpty = () => selectionManager().isEmpty();

  const selectedItems = () => {
    return [...selectionManager().selectedKeys()]
      .map(key => context.listState().collection().getItem(key))
      .filter(Boolean) as CollectionNode[];
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
        <MultiSelectValueChild state={{ selectedItems }} children={local.children} />
      </Show>
    </Polymorphic>
  );
}

interface MultiSelectValueChildProps extends Pick<MultiSelectValueOptions, "children"> {
  state: MultiSelectValueState;
}

function MultiSelectValueChild(props: MultiSelectValueChildProps) {
  return children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });
}
