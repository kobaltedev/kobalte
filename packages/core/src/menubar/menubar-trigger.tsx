import { type ValidComponent, createUniqueId } from "solid-js";

import { MenuTrigger, type MenuTriggerProps } from "../menu";
import { useOptionalMenuContext } from "../menu/menu-context";
import type { PolymorphicProps } from "../polymorphic";
import { useMenubarContext } from "./menubar-context";
import { MenubarMenu } from "./menubar-menu";

/**
 * The button that toggles the menubar menu or a menubar link.
 */
export function MenubarTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, MenuTriggerProps<T>>,
) {
	const menubarContext = useMenubarContext();
	const menuContext = useOptionalMenuContext();

	if (menuContext === undefined && Object.hasOwn(props, "href")) {
		const id = menubarContext.generateId("link-trigger-") + createUniqueId();

		return (
			<MenubarMenu value={id}>
				<MenuTrigger {...props} />
			</MenubarMenu>
		);
	}

	return MenuTrigger(props);
}
