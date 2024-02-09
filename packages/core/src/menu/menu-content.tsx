import { OverrideComponentProps, mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { createPreventScroll } from "../primitives";
import { MenuContentBase, MenuContentBaseOptions } from "./menu-content-base";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuContentOptions extends MenuContentBaseOptions {}

export interface MenuContentProps
	extends OverrideComponentProps<"div", MenuContentOptions> {}

export function MenuContent(props: MenuContentProps) {
	const rootContext = useMenuRootContext();
	const context = useMenuContext();

	createPreventScroll({
		enabled: () => context.isOpen() && rootContext.preventScroll(),
	});

	return <MenuContentBase {...props} />;
}
