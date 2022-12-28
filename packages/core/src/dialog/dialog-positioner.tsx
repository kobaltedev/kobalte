import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext } from "./dialog-context";

export interface DialogPositionerOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * A wrapper component to help positioning the dialog content on screen.
 */
export const DialogPositioner = createPolymorphicComponent<"div", DialogPositionerOptions>(
  props => {
    const context = useDialogContext();

    props = mergeDefaultProps({ as: "div" }, props);

    const [local, others] = splitProps(props, ["as", "style"]);

    return (
      <Show when={context.shouldMount()}>
        <Dynamic
          component={local.as}
          // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling.
          style={{ "pointer-events": "auto", ...local.style }}
          {...others}
        />
      </Show>
    );
  }
);
