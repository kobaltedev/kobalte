import { OverrideComponentProps, mergeRefs } from "@kobalte/utils";
import { Component, splitProps, ValidComponent } from "solid-js";

import createPreventScroll from "solid-prevent-scroll";
import { PolymorphicProps } from "../polymorphic";
import {
	MenuContentBase,
	MenuContentBaseCommonProps,
	MenuContentBaseOptions,
	MenuContentBaseRenderProps,
} from "./menu-content-base";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuContentOptions extends MenuContentBaseOptions {}

export interface MenuContentCommonProps extends MenuContentBaseCommonProps {
}

export interface MenuContentRenderProps extends MenuContentCommonProps, MenuContentBaseRenderProps {}

export type MenuContentProps = MenuContentOptions & Partial<MenuContentCommonProps>;

export function MenuContent<T extends ValidComponent = "div">(props: PolymorphicProps<T, MenuContentProps>) {
	let ref: HTMLElement | undefined;

	const rootContext = useMenuRootContext();
	const context = useMenuContext();

	const [local, others] = splitProps(props as MenuContentProps, ["ref"]);

	createPreventScroll({
		element: () => ref ?? null,
		enabled: () => context.isOpen() && rootContext.preventScroll(),
	});

	return (
		<MenuContentBase<Component<Omit<MenuContentRenderProps, keyof MenuContentBaseRenderProps>>>
			ref={mergeRefs((el) => {
				ref = el;
			}, local.ref)}
			{...others}
		/>
	);
}
