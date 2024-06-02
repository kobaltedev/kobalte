import { MenuPortal, MenuPortalProps, useMenuContext } from "../menu";
import { useNavigationMenuContext } from "./navigation-menu-context";
import { Show } from "solid-js";

export interface NavigationMenuPortalProps extends MenuPortalProps {}

/**
 * Portals its children into the NavigationMenu.Viewport when the menu is open.
 */
export function NavigationMenuPortal(props: NavigationMenuPortalProps) {
	const context = useNavigationMenuContext();
	const menuContext = useMenuContext();

	return (
		<Show when={context.viewportPresent()}>
			<MenuPortal
				mount={
					menuContext.parentMenuContext() == null
						? context.viewportRef()
						: undefined
				}
				{...props}
			/>
		</Show>
	);
}
