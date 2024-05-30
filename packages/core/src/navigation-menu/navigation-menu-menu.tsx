import { MenubarMenuOptions, MenubarMenuProps } from "../menubar";
import { MenubarMenu } from "../menubar/menubar-menu";
import { useMenubarContext } from "../menubar/menubar-context";
import { createEffect, createSignal, createUniqueId, on, splitProps } from "solid-js";
import { useNavigationMenuContext } from "./navigation-menu-context";
import { mergeDefaultProps } from "@kobalte/utils";

export interface NavigationMenuMenuOptions extends MenubarMenuOptions {}

export interface NavigationMenuMenuProps extends MenubarMenuProps {}

/**
 * Displays a menu to the user —such as a set of actions or functions— triggered by a button.
 */
export function NavigationMenuMenu(props: NavigationMenuMenuProps) {
	const menubarContext = useMenubarContext();
	const context = useNavigationMenuContext();

	const [local, others] = splitProps(props, ["value"]);

	const uniqueid = createUniqueId();

	const defaultId = menubarContext.generateId(`navigation-menu-menu-${uniqueid}`);

	const mergedPropsWithId = mergeDefaultProps({ id: defaultId }, others);

	const value = () => local.value ?? uniqueid;

	const [forceMount, setForceMount] = createSignal(false);

	const animationEnd = () => {
		setForceMount(false);

		context.viewportRef()?.removeEventListener("animationend", animationEnd);
		context.viewportRef()?.removeEventListener("animationcancel", animationEnd);
	}


	createEffect(on(() => [menubarContext.value(), menubarContext.dataset()["data-expanded"]], ([contextValue, expanded]) => {
		if ((contextValue && !contextValue?.includes("link-trigger-")) || expanded) {
			setForceMount(false)
			return;
		}
		if (context.previousMenu() !== value()) return;

		const viewportRef = context.viewportRef();

		if (!viewportRef) return;

		if (["", "none"].includes(window.getComputedStyle(viewportRef).animationName)) return;

		viewportRef.addEventListener("animationend", animationEnd);
		viewportRef.addEventListener("animationcancel", animationEnd);

		setForceMount(true);
	}))

//	createEffect(() => {
//		if (context.previousMenu() !== props.value) return;
//
//		setForceMount(context.previousMenu() === props.value)
//	})

	return <MenubarMenu forceMount={forceMount()} value={value()} {...mergedPropsWithId} />;
}
