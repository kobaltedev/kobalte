import {
	createEffect,
	createSignal,
	createUniqueId,
	merge,
	omit,
} from "solid-js";
import type {
	MenubarMenuOptions,
	MenubarMenuProps,
} from "../menubar/index.tsx";
import { useMenubarContext } from "../menubar/menubar-context.tsx";
import { MenubarMenu } from "../menubar/menubar-menu.tsx";
import { useNavigationMenuContext } from "./navigation-menu-context.tsx";

export interface NavigationMenuMenuOptions extends MenubarMenuOptions {}

export interface NavigationMenuMenuProps extends MenubarMenuProps {}

/**
 * Displays a menu to the user —such as a set of actions or functions— triggered by a button.
 */
export function NavigationMenuMenu(props: NavigationMenuMenuProps) {
	const menubarContext = useMenubarContext();
	const context = useNavigationMenuContext();

	const others = omit(props, "value");

	const uniqueid = createUniqueId();

	const defaultId = menubarContext.generateId(
		`navigation-menu-menu-${uniqueid}`,
	);

	const mergedPropsWithId = merge({ id: defaultId }, others);

	const value = () => props.value ?? uniqueid;

	const [forceMount, setForceMount] = createSignal(false);

	const animationEnd = () => {
		if (menubarContext.value() !== value()) {
			setForceMount(false);
		}

		context.viewportRef()?.removeEventListener("animationend", animationEnd);
		context.viewportRef()?.removeEventListener("animationcancel", animationEnd);
	};

	createEffect(
		() => menubarContext.value(),
		(contextValue) => {
			if (contextValue === value()) {
				setForceMount(true);
			} else {
				const viewportRef = context.viewportRef();

				if (
					!viewportRef ||
					["", "none"].includes(
						window.getComputedStyle(viewportRef).animationName,
					)
				) {
					setForceMount(false);
					return;
				}

				viewportRef.addEventListener("animationend", animationEnd);
			}
		},
	);

	return (
		<MenubarMenu
			forceMount={forceMount()}
			value={value()}
			{...mergedPropsWithId}
		/>
	);
}
