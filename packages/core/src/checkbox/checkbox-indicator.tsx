import { mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { createPresence } from "../primitives";
import { useCheckboxContext } from "./checkbox-context";

export interface CheckboxIndicatorOptions {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The visual indicator rendered when the checkbox is in a checked or indeterminate state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function CheckboxIndicator(props: OverrideComponentProps<"div", CheckboxIndicatorOptions>) {
  const context = useCheckboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("indicator"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "forceMount"]);

  const presence = createPresence(
    () => local.forceMount || context.isIndeterminate() || context.isChecked()
  );

  return (
    <Show when={presence.isPresent()}>
      <Polymorphic
        fallback="div"
        ref={mergeRefs(presence.setRef, local.ref)}
        {...context.dataset()}
        {...others}
      />
    </Show>
  );
}
