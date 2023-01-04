import { ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useMenuContext } from "./menu-context";

/**
 * Portals its children into the `body` when the menu is open.
 */
export function MenuPortal(props: ComponentProps<typeof Portal>) {
  const context = useMenuContext();

  return (
    <Show when={context.shouldMount()}>
      <Portal {...props} />
    </Show>
  );
}
