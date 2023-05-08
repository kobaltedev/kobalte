import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useListboxItemContext } from "./listbox-item-context";

export interface ListboxItemIndicatorOptions extends AsChildProp {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

export interface ListboxItemIndicatorProps
  extends OverrideComponentProps<"div", ListboxItemIndicatorOptions> {}

/**
 * The visual indicator rendered when the item is selected.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function ListboxItemIndicator(props: ListboxItemIndicatorProps) {
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
      <Polymorphic as="div" aria-hidden="true" {...context.dataset()} {...others} />
    </Show>
  );
}
