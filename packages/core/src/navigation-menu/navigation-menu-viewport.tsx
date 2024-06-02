import { Orientation, mergeRefs } from "@kobalte/utils";
import {
	Component,
	JSX,
	Show,
	ValidComponent,
	createEffect,
	createMemo,
	createSignal,
	on,
	splitProps,
} from "solid-js";
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

export interface NavigationMenuViewportCommonProps {
	ref: HTMLElement | ((el: HTMLElement) => void);
	/** The HTML styles attribute (object form only). */
	style: JSX.CSSProperties;
}

export interface NavigationMenuViewportRenderProps
	extends NavigationMenuViewportCommonProps,
		DismissableLayerRenderProps,
		MenubarDataSet {
	"data-orientation": Orientation;
}

export type NavigationMenuViewportProps = NavigationMenuViewportOptions &
	Partial<NavigationMenuViewportCommonProps>;

export function NavigationMenuViewport<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, NavigationMenuViewportProps>,
) {
	const context = useNavigationMenuContext();
	const menubarContext = useMenubarContext();

	const [ref, setRef] = createSignal<HTMLElement>();

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

	const size = createSize(ref);

	createEffect(
		on(
			() =>
				menubarContext.value()
					? menubarContext.menuRefMap().get(menubarContext.value()!)
					: undefined,
			(menu) => {
				if (menu === undefined || menu[0] === undefined) return;
				setRef(menu[0]);
			},
		),
	);

	const height = createMemo((prev) => {
		if (size.height() === 0) return prev;
		return size.height();
	});
	const width = createMemo((prev) => {
		if (size.width() === 0) return prev;
		return size.width();
	});

	createEffect(() =>
		console.log(context.viewportPresent(), menubarContext.dataset()),
	);

	const [expanded, setExpanded] = createSignal(false);

	createEffect((init) => {
		const datasetExpanded = menubarContext.dataset()["data-expanded"] === "";

		console.log("init", init);

		if (context.viewportPresent() && init) {
			console.log("settrue");
			setExpanded(true);
			return false;
		}

		if (!context.viewportPresent()) {
			return true;
		}

		if (!init) {
			console.log("set", datasetExpanded);
			setExpanded(datasetExpanded);
			return false;
		}
	}, true);

	return (
		<Show when={context.viewportPresent()}>
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
						"--kb-menu-content-transform-origin":
							"var(--kb-popper-content-transform-origin)",
						"--kb-navigation-menu-viewport-height": height()
							? `${height()}px`
							: undefined,
						"--kb-navigation-menu-viewport-width": width()
							? `${width()}px`
							: undefined,
						position: "relative",
						...local.style,
					}}
					onEscapeKeyDown={onEscapeKeyDown}
					onDismiss={close}
					data-expanded={expanded() ? "" : undefined}
					data-closed={expanded() ? undefined : ""}
					data-orientation={menubarContext.orientation()}
					{...others}
				/>
			</Popper.Positioner>
		</Show>
	);
}
