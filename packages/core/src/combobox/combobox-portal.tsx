import { type ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useComboboxContext } from "./combobox-context";

export interface ComboboxPortalProps extends ComponentProps<typeof Portal> {}

/**
 * Portals its children into the `body` when the combobox is open.
 */
export function ComboboxPortal(props: ComboboxPortalProps) {
	const context = useComboboxContext();

	return (
		<Show when={context.contentPresent()}>
			<Portal {...props} />
		</Show>
	);
}
