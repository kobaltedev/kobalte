import { callHandler } from "@kobalte/utils";
import { type JSX, type ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";

import type {
	MenuTriggerCommonProps,
	MenuTriggerOptions,
	MenuTriggerRenderProps,
} from "../menu";
import { useOptionalMenuContext } from "../menu/menu-context";
import { MenubarTrigger } from "../menubar/menubar-trigger";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useNavigationMenuContext } from "./navigation-menu-context";

export interface NavigationMenuTriggerOptions extends MenuTriggerOptions {}

export interface NavigationMenuTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> extends MenuTriggerCommonProps<T> {
	onPointerEnter: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface NavigationMenuTriggerRenderProps
	extends NavigationMenuTriggerCommonProps,
		MenuTriggerRenderProps {}

export type NavigationMenuTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = NavigationMenuTriggerOptions &
	Partial<NavigationMenuTriggerCommonProps<ElementOf<T>>>;

/**
 * The button that toggles the menubar menu or a menubar link.
 */
export function NavigationMenuTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, NavigationMenuTriggerProps<T>>,
) {
	const context = useNavigationMenuContext();
	const menuContext = useOptionalMenuContext();

	const others = omit(props as NavigationMenuTriggerProps, "onPointerEnter", "onPointerLeave", "onClick");

	let timeoutId: number | undefined;

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, props.onClick as JSX.EventHandlerUnion<HTMLElement, MouseEvent> | undefined);

		if (timeoutId) clearTimeout(timeoutId);
	};

	const onPointerEnter: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, props.onPointerEnter as JSX.EventHandlerUnion<HTMLElement, PointerEvent> | undefined);

		if (e.pointerType === "touch") return;

		context.cancelLeaveTimer();

		if (context.dataset()["data-expanded"] === "") return;

		timeoutId = window.setTimeout(() => {
			menuContext?.triggerRef()?.focus();
			setTimeout(() => {
				context.setAutoFocusMenu(true);
			});
		}, context.delayDuration());
	};

	const onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, props.onPointerLeave as JSX.EventHandlerUnion<HTMLElement, PointerEvent> | undefined);

		if (e.pointerType === "touch") return;

		context.startLeaveTimer();
		if (timeoutId) clearTimeout(timeoutId);
	};

	return (
		<li role="presentation">
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
		</li>
	);
}
