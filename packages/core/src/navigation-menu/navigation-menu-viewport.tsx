import {
	type Orientation,
	composeEventHandlers,
	mergeRefs,
} from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import { type JSX, type ValidComponent } from "@solidjs/web";
import {
	type Component,
	Show,
	createEffect,
	createMemo,
	createSignal,
	omit,
} from "solid-js";
import {
	DismissableLayer,
	type DismissableLayerRenderProps,
} from "../dismissable-layer";
import {
	type MenubarDataSet,
	useMenubarContext,
} from "../menubar/menubar-context";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { Popper } from "../popper";
import type {
	FocusOutsideEvent,
	InteractOutsideEvent,
	PointerDownOutsideEvent,
} from "@solid-primitives/interaction";
import { createSize } from "../primitives/create-size";
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

export interface NavigationMenuViewportCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties | string;
}

export interface NavigationMenuViewportRenderProps
	extends NavigationMenuViewportCommonProps,
		DismissableLayerRenderProps,
		MenubarDataSet {
	"data-orientation": Orientation;
}

export type NavigationMenuViewportProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = NavigationMenuViewportOptions &
	Partial<NavigationMenuViewportCommonProps<ElementOf<T>>>;

export function NavigationMenuViewport<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, NavigationMenuViewportProps<T>>,
) {
	const context = useNavigationMenuContext();
	const menubarContext = useMenubarContext();

	const [ref, setRef] = createSignal<HTMLElement>();

	const others = omit(props as NavigationMenuViewportProps, "ref", "style", "onEscapeKeyDown");

	const close = () => {
		menubarContext.setAutoFocusMenu(false);
		menubarContext.closeMenu();
	};

	const onEscapeKeyDown = (e: KeyboardEvent) => {
		close();
	};

	const size = createSize(ref);

	createEffect(
		() =>
			menubarContext.value()
				? menubarContext.menuRefMap().get(menubarContext.value()!)
				: undefined,
		(menu) => {
			if (menu === undefined || menu[0] === undefined) return;
			setRef(menu[0]);
		},
	);

	const height = createMemo((prev) => {
		if (ref() === undefined || !context.viewportPresent()) return undefined;
		if (size.height() === 0) return prev;
		return size.height();
	});
	const width = createMemo((prev) => {
		if (ref() === undefined || !context.viewportPresent()) return undefined;
		if (size.width() === 0) return prev;
		return size.width();
	});

	return (
		<Show when={context.viewportPresent()}>
			<Popper.Positioner role="presentation">
				<DismissableLayer<
					Component<
						Omit<
							NavigationMenuViewportRenderProps,
							keyof DismissableLayerRenderProps
						>
					>
				>
					as="li"
					ref={mergeRefs(context.setViewportRef, props.ref)}
					excludedElements={[context.rootRef]}
					bypassTopMostLayerCheck
					style={combineStyle(
						{
							"--kb-menu-content-transform-origin":
								"var(--kb-popper-content-transform-origin)",
							"--kb-navigation-menu-viewport-height": height()
								? `${height()}px`
								: undefined,
							"--kb-navigation-menu-viewport-width": width()
								? `${width()}px`
								: undefined,
							position: "relative",
						},
						props.style,
					)}
					onEscapeKeyDown={composeEventHandlers([
						props.onEscapeKeyDown,
						onEscapeKeyDown,
					])}
					onDismiss={close}
					data-orientation={menubarContext.orientation()}
					{...context.dataset()}
					{...others}
				/>
			</Popper.Positioner>
		</Show>
	);
}
