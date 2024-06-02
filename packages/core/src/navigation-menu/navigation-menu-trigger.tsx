import { callHandler } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";

import {
	MenuTriggerCommonProps,
	MenuTriggerOptions,
	MenuTriggerRenderProps,
} from "../menu";
import { useOptionalMenuContext } from "../menu/menu-context";
import { MenubarTrigger } from "../menubar/menubar-trigger";
import { PolymorphicProps } from "../polymorphic";
import { useNavigationMenuContext } from "./navigation-menu-context";

export interface NavigationMenuTriggerOptions extends MenuTriggerOptions {}

export interface NavigationMenuTriggerCommonProps
	extends MenuTriggerCommonProps {
	onPointerEnter: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
	onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
}

export interface NavigationMenuTriggerRenderProps
	extends NavigationMenuTriggerCommonProps,
		MenuTriggerRenderProps {}

export type NavigationMenuTriggerProps = NavigationMenuTriggerOptions &
	Partial<NavigationMenuTriggerCommonProps>;

/**
 * The button that toggles the menubar menu or a menubar link.
 */
export function NavigationMenuTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, NavigationMenuTriggerProps>,
) {
	const context = useNavigationMenuContext();
	const menuContext = useOptionalMenuContext();

	const [local, others] = splitProps(props as NavigationMenuTriggerProps, [
		"onPointerEnter",
		"onPointerLeave",
		"onClick",
	]);

	let timeoutId: number | undefined;

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		if (timeoutId) clearTimeout(timeoutId);
	};

	const onPointerEnter: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerEnter);

		context.cancelLeaveTimer();

		if (context.dataset()["data-expanded"] === "") return;

		timeoutId = window.setTimeout(() => {
			context.setAutoFocusMenu(true);
			menuContext?.triggerRef()?.focus();
		}, context.delayDuration());
	};

	const onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerLeave);

		context.startLeaveTimer();
		if (timeoutId) clearTimeout(timeoutId);
	};

	return (
		<MenubarTrigger<
			Component<
				Omit<NavigationMenuTriggerRenderProps, keyof MenuTriggerRenderProps>
			>
		>
			onClick={onClick}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			{...others}
		/>
	);
}
