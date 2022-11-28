import { ComponentProps, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";

import { usePopoverContext } from "./popover-context";

export interface PopoverPortalProps extends ComponentProps<typeof Portal> {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * Portals its children into the `body` when the popover is open.
 */
export function PopoverPortal(props: PopoverPortalProps) {
  const context = usePopoverContext();

  const [local, others] = splitProps(props, ["forceMount"]);

  return (
    <Show when={local.forceMount || context.isOpen()}>
      <Portal {...others} />
    </Show>
  );
}
