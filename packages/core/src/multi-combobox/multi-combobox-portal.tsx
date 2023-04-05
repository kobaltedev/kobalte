import { ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useComboboxContext } from "./combobox-context";

export interface MultiComboboxPortalProps extends ComponentProps<typeof Portal> {}

/**
 * Portals its children into the `body` when the combobox is open.
 */
export function MultiComboboxPortal(props: MultiComboboxPortalProps) {
  const context = useComboboxContext();

  return (
    <Show when={context.contentPresence.isPresent()}>
      <Portal {...props} />
    </Show>
  );
}
