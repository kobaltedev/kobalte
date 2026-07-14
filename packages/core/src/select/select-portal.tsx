import { type ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useSelectContext } from "./select-context.tsx";

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
