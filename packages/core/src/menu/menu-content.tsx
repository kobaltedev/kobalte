import { OverrideComponentProps, mergeRefs } from "@kobalte/utils";
import { type Component, type ValidComponent, splitProps } from "solid-js";

import createPreventScroll from "solid-prevent-scroll";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	MenuContentBase,
	type MenuContentBaseCommonProps,
	type MenuContentBaseOptions,
	type MenuContentBaseRenderProps,
} from "./menu-content-base";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuContentOptions extends MenuContentBaseOptions {}

export interface MenuContentCommonProps<T extends HTMLElement = HTMLElement>
	extends MenuContentBaseCommonProps<T> {}

export interface MenuContentRenderProps
	extends MenuContentCommonProps,
		MenuContentBaseRenderProps {}

export type MenuContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuContentOptions & Partial<MenuContentCommonProps<ElementOf<T>>>;

export function MenuContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuContentProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const rootContext = useMenuRootContext();
	const context = useMenuContext();

	const [local, others] = splitProps(props as MenuContentProps, ["ref"]);

	createPreventScroll({
		element: () => ref ?? null,
		enabled: () => context.contentPresent() && rootContext.preventScroll(),
	});

	return (
		<MenuContentBase<
			Component<Omit<MenuContentRenderProps, keyof MenuContentBaseRenderProps>>
		>
			ref={mergeRefs((el) => {
				ref = el;
			}, local.ref)}
			{...others}
		/>
	);
}
