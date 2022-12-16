import { createPolymorphicComponent, isFunction, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createEffect, createMemo, JSX, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useFormControlContext } from "../form-control";
import { useSelectContext } from "./select-context";
import { CollectionKey } from "../primitives";

type SelectValueRenderProp = (selectedValues: Accessor<Set<CollectionKey>>) => JSX.Element;

export interface SelectValueProps {
  /** The content that will be rendered when no value or defaultValue is set. */
  placeholder?: JSX.Element;

  /** The content that will be rendered when a value is set. */
  children?: SelectValueRenderProp | JSX.Element;
}

export const SelectValue = createPolymorphicComponent<"span", SelectValueProps>(props => {
  const formControlContext = useFormControlContext();
  const context = useSelectContext();

  props = mergeDefaultProps({ as: "span", id: context.generateId("value") }, props);

  const [local, others] = splitProps(props, ["as", "id", "children", "placeholder"]);

  const selectionManager = () => context.listState().selectionManager();
  const isSelectionEmpty = () => selectionManager().isEmpty();

  const valueLabels = createMemo(() => {
    return [...selectionManager().selectedKeys()]
      .map(key => context.listState().collection().getItem(key)?.label ?? key)
      .join(", ");
  });

  createEffect(() => onCleanup(context.registerValue(local.id!)));

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
          <Show when={isFunction(local.children)} fallback={local.children as JSX.Element}>
            {(local.children as SelectValueRenderProp)?.(selectionManager().selectedKeys)}
          </Show>
        </Show>
      </Show>
    </Dynamic>
  );
});
