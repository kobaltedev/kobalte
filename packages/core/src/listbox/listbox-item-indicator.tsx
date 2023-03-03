import {
  createPolymorphicComponent,
  mergeDefaultProps,
  OverrideComponentProps,
} from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useListboxItemContext } from "./listbox-item-context";
import { Polymorphic } from "../polymorphic";

export interface ListboxItemIndicatorOptions {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The visual indicator rendered when the item is selected.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function ListboxItemIndicator(
  props: OverrideComponentProps<"div", ListboxItemIndicatorOptions>
) {
  const context = useListboxItemContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("indicator"),
    },
    props
  );

  const [local, others] = splitProps(props, ["forceMount"]);

  return (
    <Show when={local.forceMount || context.isSelected()}>
      <Polymorphic fallback="div" aria-hidden="true" {...context.dataset()} {...others} />
    </Show>
  );
}
