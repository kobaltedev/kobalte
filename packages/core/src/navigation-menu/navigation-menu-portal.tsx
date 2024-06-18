import { mergeRefs } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { MenuPortal, type MenuPortalProps, useMenuContext } from "../menu";
import { useNavigationMenuContext } from "./navigation-menu-context";

export interface NavigationMenuPortalProps extends MenuPortalProps {}

/**
 * Portals its children into the NavigationMenu.Viewport when the menu is open.
 */
export function NavigationMenuPortal(props: NavigationMenuPortalProps) {
	const context = useNavigationMenuContext();
	const menuContext = useMenuContext();

	const [local, others] = splitProps(props, ["ref"]);

	return (
		<Show when={context.viewportPresent()}>
			<MenuPortal
				ref={mergeRefs((ref) => {
					if (ref) ref.setAttribute("role", "presentation");
				}, local.ref)}
				mount={
					menuContext.parentMenuContext() == null
						? context.viewportRef()
						: undefined
				}
				{...others}
			/>
		</Show>
	);
}
