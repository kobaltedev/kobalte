import { type ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useTooltipContext } from "./tooltip-context";

export interface TooltipPortalProps extends ComponentProps<typeof Portal> {}

/**
 * Portals its children into the `body` when the tooltip is open.
 */
export function TooltipPortal(props: TooltipPortalProps) {
	const context = useTooltipContext();

	return (
		<Show when={context.contentPresent()}>
			<Portal {...props} />
		</Show>
	);
}
