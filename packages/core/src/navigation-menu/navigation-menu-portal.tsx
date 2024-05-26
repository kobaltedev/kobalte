import { MenuPortal, MenuPortalProps } from "../menu";
import { useNavigationMenuContext } from "./navigation-menu-context";

export interface NavigationMenuPortalProps extends MenuPortalProps {}

/**
 * Portals its children into the NavigationMenu.Viewport when the menu is open.
 */
export function NavigationMenuPortal(props: NavigationMenuPortalProps) {
	const context = useNavigationMenuContext();

	return <MenuPortal mount={context.viewportRef()} {...props} />;
}
