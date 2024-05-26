import { MenubarMenuOptions, MenubarMenuProps } from "../menubar";
import { MenubarMenu } from "../menubar/menubar-menu";

export interface NavigationMenuMenuOptions extends MenubarMenuOptions {}

export interface NavigationMenuMenuProps extends MenubarMenuProps {}

/**
 * Displays a menu to the user —such as a set of actions or functions— triggered by a button.
 */
export function NavigationMenuMenu(props: NavigationMenuMenuProps) {
	//	const menubarContext = useNavigationMenuContext();

	return <MenubarMenu {...props} />;
}
