import { mergeRefs } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps, createEffect, on } from "solid-js";
import {
	DismissableLayer,
	DismissableLayerRenderProps,
} from "../dismissable-layer";
import { MenubarDataSet, useMenubarContext } from "../menubar/menubar-context";
import { PolymorphicProps } from "../polymorphic";
import { Popper } from "../popper";
import {
	FocusOutsideEvent,
	InteractOutsideEvent,
	PointerDownOutsideEvent,
} from "../primitives/create-interact-outside";
import { useNavigationMenuContext } from "./navigation-menu-context";

export interface NavigationMenuViewportOptions {
	/**
	 * Event handler called when the escape key is down.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;

	/**
	 * Event handler called when a pointer event occurs outside the bounds of the component.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

	/**
	 * Event handler called when the focus moves outside the bounds of the component.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onFocusOutside?: (event: FocusOutsideEvent) => void;

	/**
	 * Event handler called when an interaction (pointer or focus event) happens outside the bounds of the component.
	 * It can be prevented by calling `event.preventDefault`.
	 */
	onInteractOutside?: (event: InteractOutsideEvent) => void;
}

export interface NavigationMenuViewportCommonProps {
	ref: HTMLElement | ((el: HTMLElement) => void);
	/** The HTML styles attribute (object form only). */
	style: JSX.CSSProperties;
}

export interface NavigationMenuViewportRenderProps
	extends NavigationMenuViewportCommonProps,
		DismissableLayerRenderProps,
		MenubarDataSet {}

export type NavigationMenuViewportProps = NavigationMenuViewportOptions &
	Partial<NavigationMenuViewportCommonProps>;

export function NavigationMenuViewport<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, NavigationMenuViewportProps>,
) {
	const context = useNavigationMenuContext();
	const menubarContext = useMenubarContext();

	const [local, others] = splitProps(props as NavigationMenuViewportProps, [
		"ref",
		"style",
		"onEscapeKeyDown",
	]);

	const close = () => {
		menubarContext.setAutoFocusMenu(false);
		menubarContext.closeMenu();
	};

	const onEscapeKeyDown = (e: KeyboardEvent) => {
		local.onEscapeKeyDown?.(e);

		close();
	};

	const updateSize = (element: HTMLElement) => {
		if (element.offsetHeight === 0 || element.offsetWidth === 0) return;

		context.setViewportHeight(element.offsetHeight);
		context.setViewportWidth(element.offsetWidth);
	}

	let previousOpenState = false;

	createEffect(on(() => menubarContext.value() ? menubarContext.menuRefMap().get(menubarContext.value()!) : undefined, (menu) => {
		if (menu === undefined) {
			context.setViewportHeight(undefined);
			context.setViewportWidth(undefined);
			previousOpenState = false;
			return;
		}
		if (menu[0] === undefined) return;

		const animations = menu[0].getAnimations();

		if (previousOpenState || animations.length === 0) {
			updateSize(menu[0]);
		}

		animations.map(animation => animation.finished.then(() => {
			updateSize(menu[0]);
		}));

		previousOpenState = true;
	}))

	return (
		<Popper.Positioner>
			<DismissableLayer<
				Component<
					Omit<
						NavigationMenuViewportRenderProps,
						keyof DismissableLayerRenderProps
					>
				>
			>
				ref={mergeRefs(context.setViewportRef, local.ref)}
				excludedElements={[context.rootRef]}
				bypassTopMostLayerCheck
				style={{
					"--kb-menu-content-transform-origin":	"var(--kb-popper-content-transform-origin)",
					"--kb-navigation-menu-viewport-height": context.viewportHeight() ? `${context.viewportHeight()}px` : undefined,
					"--kb-navigation-menu-viewport-width": context.viewportWidth() ? `${context.viewportWidth()}px` : undefined,
					position: "relative",
					...local.style,
				}}
				onEscapeKeyDown={onEscapeKeyDown}
				onDismiss={close}
				{...menubarContext.dataset()}
				{...others}
			/>
		</Popper.Positioner>
	);
}
