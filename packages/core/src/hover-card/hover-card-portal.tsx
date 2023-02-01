import { ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useHoverCardContext } from "./hover-card-context";

/**
 * Portals its children into the `body` when the hovercard is open.
 */
export function HoverCardPortal(props: ComponentProps<typeof Portal>) {
  const context = useHoverCardContext();

  return (
    <Show when={context.contentPresence.isPresent()}>
      <Portal {...props} />
    </Show>
  );
}
