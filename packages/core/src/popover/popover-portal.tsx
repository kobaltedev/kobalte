import { ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { usePopoverContext } from "./popover-context";

/**
 * Portals its children into the `body` when the popover is open.
 */
export function PopoverPortal(props: ComponentProps<typeof Portal>) {
  const context = usePopoverContext();

  return (
    <Show when={context.shouldMount()}>
      <Portal {...props} />
    </Show>
  );
}
