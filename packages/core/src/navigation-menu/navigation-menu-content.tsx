import { callHandler } from "@kobalte/utils";
import {
	Component,
	JSX,
	ValidComponent,
	splitProps,
	createSignal,
	createEffect,
	on,
	onCleanup,
	onMount,
} from "solid-js";

import {
	MenuContent,
	MenuContentCommonProps,
	MenuContentOptions,
	MenuContentRenderProps,
} from "../menu";
import { useMenuContext } from "../menu/menu-context";
import { useMenuRootContext } from "../menu/menu-root-context";
import { useMenubarContext } from "../menubar/menubar-context";
import { PolymorphicProps } from "../polymorphic";
import { useNavigationMenuContext } from "./navigation-menu-context";

export type Motion = "to-start" | "to-end" | "from-start" | "from-end";

export interface NavigationMenuContentOptions extends MenuContentOptions {}

export interface NavigationMenuContentCommonProps
	extends MenuContentCommonProps {
	onPointerEnter: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
	onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent>;
}

export interface NavigationMenuContentRenderProps
	extends MenuContentRenderProps,
		NavigationMenuContentCommonProps {
	"data-motion"?: Motion;
}

export type NavigationMenuContentProps = NavigationMenuContentOptions &
	Partial<NavigationMenuContentCommonProps>;

export function NavigationMenuContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, NavigationMenuContentProps>,
) {
	const context = useNavigationMenuContext();
	const menubarContext = useMenubarContext();
	const menuContext = useMenuContext();
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

		menuContext.close(true);
	};

	onMount(() => {
		if (context.previousMenu() !== undefined) {
			const menus = [...menubarContext.menus()];
			const prevIndex = menus.indexOf(context.previousMenu()!);
			const nextIndex = menus.indexOf(menuRootContext.value()!);

			if (prevIndex < nextIndex) setMotion("from-end");
			else setMotion("from-start");
		}

		context.setPreviousMenu(menuRootContext.value())}
	);

	onCleanup(() => {
		if (menubarContext.value() && !menubarContext.value()!.includes("link-trigger-")) return;
		if (context.previousMenu() === menuRootContext.value()) context.setPreviousMenu(undefined);
	});

	createEffect(on(menubarContext.value, (current) => {
		if (!current) return;

		if (current === menuRootContext.value()) return;

		if (current.includes("link-trigger-")) return;

		const menus = [...menubarContext.menus()];
		const prevIndex = menus.indexOf(menuRootContext.value()!);
		const nextIndex = menus.indexOf(current);

		if (prevIndex > nextIndex) setMotion("to-end");
		else setMotion("to-start");
	}));

	return (
		<MenuContent<
			Component<
				Omit<NavigationMenuContentRenderProps, keyof MenuContentRenderProps>
			>
		>
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
		 	data-motion={motion()}
			{...others}
		/>
	);
}
