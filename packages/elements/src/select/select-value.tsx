import { createPolymorphicComponent, isFunction, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createMemo, JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createLocalizedStringFormatter } from "../i18n";
import { SelectionType } from "../selection";
import { SELECT_INTL_MESSAGES } from "./select.intl";
import { useSelectContext } from "./select-context";

type SelectValueRenderProp = (selectedValues: Accessor<SelectionType>) => JSX.Element;

export interface SelectValueProps {
  /** The content that will be rendered when no value or defaultValue is set. */
  placeholder?: JSX.Element;

  children?: SelectValueRenderProp | JSX.Element;
}

export const SelectValue = createPolymorphicComponent<"span", SelectValueProps>(props => {
  const context = useSelectContext();

  props = mergeDefaultProps({ as: "span" }, props);

  const [local, others] = splitProps(props, ["as", "children", "placeholder"]);

  const stringFormatter = createLocalizedStringFormatter(() => SELECT_INTL_MESSAGES);

  const selectionManager = () => context.listState().selectionManager();
  const isSelectionEmpty = () => selectionManager().isEmpty();

  const valueLabels = createMemo(() => {
    if (selectionManager().isSelectAll()) {
      return stringFormatter().format("all");
    }

    return [...selectionManager().selectedKeys()]
      .map(key => context.listState().collection().getItem(key)?.label ?? key)
      .join(", ");
  });

  return (
    <Dynamic
      component={local.as}
      data-placeholder-shown={isSelectionEmpty() ? "" : undefined}
      {...others}
    >
      <Show when={!isSelectionEmpty()} fallback={<span>{local.placeholder}</span>}>
        <Show when={local.children} fallback={valueLabels()}>
          <Show when={isFunction(local.children)} fallback={local.children as JSX.Element}>
            {(local.children as SelectValueRenderProp)?.(selectionManager().rawSelection)}
          </Show>
        </Show>
      </Show>
    </Dynamic>
  );
});
