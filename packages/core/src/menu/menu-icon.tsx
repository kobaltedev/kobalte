import { mergeDefaultProps } from "@kobalte/utils";
import { JSX, ValidComponent } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { MenuDataSet, useMenuContext } from "./menu-context";

export interface MenuIconOptions {
}

export interface MenuIconCommonProps {
	children: JSX.Element;
}

export interface MenuIconRenderProps extends MenuIconCommonProps, MenuDataSet {
	"aria-hidden": "true";
}

export type MenuIconProps = MenuIconOptions & Partial<MenuIconCommonProps>;

/**
 * A small icon often displayed inside the menu trigger as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon by providing a `children`.
 */
export function MenuIcon<T extends ValidComponent = "span">(props: PolymorphicProps<T, MenuIconProps>) {
	const context = useMenuContext();

	const mergedProps = mergeDefaultProps({ children: "▼" }, props as MenuIconProps);

	return (
		<Polymorphic<MenuIconRenderProps>
			as="span"
			aria-hidden="true"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
