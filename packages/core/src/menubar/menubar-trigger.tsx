import { ValidComponent } from "solid-js";

import { MenuTrigger, MenuTriggerProps } from "../menu";
import { useOptionalMenuContext } from "../menu/menu-context";
import { PolymorphicProps } from "../polymorphic";
import { MenubarMenu } from "./menubar-menu";

/**
 * The button that toggles the menubar menu or a menubar link.
 */
export function MenubarTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, MenuTriggerProps>,
) {
	const context = useOptionalMenuContext();

	if (context === undefined && Object.hasOwn(props, "href")) {
		return (
			<MenubarMenu>
				<MenuTrigger {...props} />
			</MenubarMenu>
		);
	}

	return MenuTrigger(props);
}
