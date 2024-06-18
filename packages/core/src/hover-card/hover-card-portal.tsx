import { type ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useHoverCardContext } from "./hover-card-context";

export interface HoverCardPortalProps extends ComponentProps<typeof Portal> {}

/**
 * Portals its children into the `body` when the hovercard is open.
 */
export function HoverCardPortal(props: HoverCardPortalProps) {
	const context = useHoverCardContext();

	return (
		<Show when={context.contentPresent()}>
			<Portal {...props} />
		</Show>
	);
}
