import { callHandler } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";

import {
	MenuContent,
	MenuContentCommonProps,
	MenuContentOptions,
	MenuContentRenderProps,
} from "../menu";
import { useMenuContext } from "../menu/menu-context";
import { PolymorphicProps } from "../polymorphic";
import { useNavigationMenuContext } from "./navigation-menu-context";
export interface NavigationMenuContentOptions extends MenuContentOptions {}

export interface NavigationMenuContentCommonProps
	extends MenuContentCommonProps {
	onPointerEnter: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
	onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
}

export interface NavigationMenuContentRenderProps
	extends MenuContentRenderProps,
		NavigationMenuContentCommonProps {}

export type NavigationMenuContentProps = NavigationMenuContentOptions &
	Partial<NavigationMenuContentCommonProps>;

export function NavigationMenuContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, NavigationMenuContentProps>,
) {
	const context = useNavigationMenuContext();
	const menuContext = useMenuContext();

	const [local, others] = splitProps(props as NavigationMenuContentProps, [
		"onPointerEnter",
		"onPointerLeave",
	]);

	const onPointerEnter: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerEnter);

		context.cancelLeaveTimer();
	};

	const onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerLeave);

		context.startLeaveTimer();

		menuContext.close(true);
	};

	return (
		<MenuContent<
			Component<
				Omit<NavigationMenuContentRenderProps, keyof MenuContentRenderProps>
			>
		>
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			{...others}
		/>
	);
}
