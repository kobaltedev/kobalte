import { type ComponentProps, Portal } from "@solidjs/web";
import { Show } from "solid-js";

import { useSelectContext } from "./select-context";

export interface SelectPortalProps extends ComponentProps<typeof Portal> {}

/**
 * Portals its children into the `body` when the select is open.
 */
export function SelectPortal(props: SelectPortalProps) {
	const context = useSelectContext();

	return (
		<Show when={context.contentPresent()}>
			<Portal {...props} />
		</Show>
	);
}
