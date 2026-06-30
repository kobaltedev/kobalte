import { type ComponentProps, Portal } from "@solidjs/web";
import { Show } from "solid-js";

import { useMenuContext } from "./menu-context";

export interface MenuPortalProps extends ComponentProps<typeof Portal> {}

/**
 * Portals its children into the `body` when the menu is open.
 */
export function MenuPortal(props: MenuPortalProps) {
	const context = useMenuContext();

	return (
		<Show when={context.contentPresent()}>
			<Portal {...props} />
		</Show>
	);
}
