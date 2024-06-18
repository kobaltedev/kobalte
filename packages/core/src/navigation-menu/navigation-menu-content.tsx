import { callHandler } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	batch,
	createEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
	splitProps,
} from "solid-js";

import {
	MenuContent,
	type MenuContentCommonProps,
	type MenuContentOptions,
	type MenuContentRenderProps,
} from "../menu";
import { useMenuRootContext } from "../menu/menu-root-context";
import { useMenubarContext } from "../menubar/menubar-context";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useNavigationMenuContext } from "./navigation-menu-context";

export type Motion = "to-start" | "to-end" | "from-start" | "from-end";

export interface NavigationMenuContentOptions extends MenuContentOptions {}

export interface NavigationMenuContentCommonProps<
	T extends HTMLElement = HTMLElement,
> extends MenuContentCommonProps<T> {
	onPointerEnter: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface NavigationMenuContentRenderProps
	extends MenuContentRenderProps,
		NavigationMenuContentCommonProps {
	"data-motion"?: Motion;
}

export type NavigationMenuContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = NavigationMenuContentOptions &
	Partial<NavigationMenuContentCommonProps<ElementOf<T>>>;

export function NavigationMenuContent<T extends ValidComponent = "ul">(
	props: PolymorphicProps<T, NavigationMenuContentProps<T>>,
) {
	const context = useNavigationMenuContext();
	const menubarContext = useMenubarContext();
	const menuRootContext = useMenuRootContext();

	const [motion, setMotion] = createSignal<Motion>();

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
	};

	createEffect(
		on(menubarContext.value, (contextValue) => {
			batch(() => {
				// When no menu open (or trigger) reset
				if (!contextValue || contextValue.includes("link-trigger-")) {
					context.setPreviousMenu(undefined);
					return;
				}

				// When currently active menu set `from-*` motion if there is a previous then upate previous menu
				if (contextValue === menuRootContext.value()) {
					if (context.previousMenu() != null) {
						const menus = [...menubarContext.menus()];
						const prevIndex = menus.indexOf(context.previousMenu()!);
						const nextIndex = menus.indexOf(contextValue);

						if (prevIndex < nextIndex) setMotion("from-end");
						else setMotion("from-start");
					} else {
						setMotion(undefined);
					}

					context.setPreviousMenu(contextValue);
					return;
				}

				const menus = [...menubarContext.menus()];
				const prevIndex = menus.indexOf(context.previousMenu()!);
				const nextIndex = menus.indexOf(contextValue);

				if (prevIndex > nextIndex) setMotion("to-end");
				else setMotion("to-start");
			});
		}),
	);

	return (
		<MenuContent<
			Component<
				Omit<NavigationMenuContentRenderProps, keyof MenuContentRenderProps>
			>
		>
			as="ul"
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			onInteractOutside={() => {
				context.setAutoFocusMenu(false);
			}}
			data-motion={motion()}
			{...others}
		/>
	);
}
