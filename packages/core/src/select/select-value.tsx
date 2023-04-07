import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps, createEffect, onCleanup, Show, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { useSelectContext } from "./select-context";

export interface SelectValueProps extends ComponentProps<"span"> {}

/**
 * The part that reflects the selected value.
 */
export function SelectValue(props: SelectValueProps) {
  const formControlContext = useFormControlContext();
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("value"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "children"]);

  const isSelectionEmpty = () => {
    const selectedKeys = context.listState().selectionManager().selectedKeys();

    // Some form libraries uses an empty string as default value, often taken from an empty `<option />`.
    // Ignore since it is not a valid key.
    if (selectedKeys.size === 1 && selectedKeys.has("")) {
      return true;
    }

    return context.listState().selectionManager().isEmpty();
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
        {context.renderValue()}
      </Show>
    </span>
  );
}
