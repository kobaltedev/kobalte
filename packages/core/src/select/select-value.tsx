import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps, createEffect, onCleanup, Show, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { useSelectContext } from "./select-context";

/**
 * The part that reflects the selected value. By default, the selected item's text will be rendered.
 * If you require more control, you can instead control the select and pass your own children.
 * An optional placeholder prop is also available for when the select has no value.
 */
export function SelectValue(props: ComponentProps<"span">) {
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
  const isSelectionEmpty = () => selectionManager().isEmpty();

  const selectedOptions = () => {
    return [...selectionManager().selectedKeys()]
      .map(key => context.listState().collection().getItem(key)?.rawValue)
      .filter(Boolean);
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
        {context.renderValue(selectedOptions)}
      </Show>
    </span>
  );
}
