import { mergeRefs } from "@kobalte/utils";
import { createPreventScroll } from "@solid-primitives/scroll";
import type { ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";
import {
	MenuContentBase,
	type MenuContentBaseCommonProps,
	type MenuContentBaseOptions,
	type MenuContentBaseRenderProps,
} from "./menu-content-base.tsx";
import { useMenuContext } from "./menu-context.tsx";
import { useMenuRootContext } from "./menu-root-context.tsx";

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

	const others = omit(props as MenuContentProps, "ref");

	createPreventScroll({
		element: () => ref ?? undefined,
		enabled: () => context.contentPresent() && rootContext.preventScroll(),
	});

	return (
		<MenuContentBase<
			Component<Omit<MenuContentRenderProps, keyof MenuContentBaseRenderProps>>
		>
			ref={mergeRefs((el: HTMLElement) => {
				ref = el;
			}, props.ref)}
			{...others}
		/>
	);
}
