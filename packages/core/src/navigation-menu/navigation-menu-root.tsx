import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	type Accessor,
	type Component,
	JSX,
	type Setter,
	type ValidComponent,
	createEffect,
	createMemo,
	createSignal,
	omit,
} from "solid-js";
import createPresence from "solid-presence";
import type {
	MenubarRootCommonProps,
	MenubarRootOptions,
	MenubarRootRenderProps,
} from "../menubar";
import { MenubarRoot } from "../menubar/menubar-root";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { Popper, type PopperRootOptions } from "../popper";
import type { Placement } from "../popper/utils";
import { createControllableSignal } from "../primitives/create-controllable-signal";
import {
	NavigationMenuContext,
	type NavigationMenuContextValue,
	type NavigationMenuDataSet,
} from "./navigation-menu-context";

export interface NavigationMenuRootOptions
	extends MenubarRootOptions,
		Omit<
			PopperRootOptions,
			"anchorRef" | "contentRef" | "onCurrentPlacementChange"
		> {
	/**
	 * Delay before the menu opens on hover (default 200).
	 */
	delayDuration?: number;

	/**
	 * Open immediately if hovered again within delay (default 300).
	 */
	skipDelayDuration?: number;

	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;

	autoFocusMenu?: boolean;
	onAutoFocusMenuChange?: Setter<boolean>;
}

export interface NavigationMenuRootCommonProps<
	T extends HTMLElement = HTMLElement,
> extends MenubarRootCommonProps<T> {
	ref: T | ((el: T) => void);
}

export interface NavigationMenuRootRenderProps
	extends NavigationMenuRootCommonProps,
		MenubarRootRenderProps {}

export type NavigationMenuRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = NavigationMenuRootOptions &
	Partial<NavigationMenuRootCommonProps<ElementOf<T>>>;

/**
 * A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
 */
export function NavigationMenuRoot<T extends ValidComponent = "ul">(
	props: PolymorphicProps<T, NavigationMenuRootProps<T>>,
) {
	const mergedProps = mergeDefaultProps(
		{
			delayDuration: 200,
			skipDelayDuration: 300,
		},
		props as NavigationMenuRootProps,
	);

	const popperProps = omit(
		mergedProps,
		"ref",
		"delayDuration",
		"skipDelayDuration",
		"autoFocusMenu",
		"onAutoFocusMenuChange",
		"defaultValue",
		"value",
		"onValueChange",
		"forceMount",
	);
	const others = omit(
		mergedProps,
		"ref",
		"delayDuration",
		"skipDelayDuration",
		"autoFocusMenu",
		"onAutoFocusMenuChange",
		"defaultValue",
		"value",
		"onValueChange",
		"forceMount",
		"getAnchorRect",
		"placement",
		"gutter",
		"shift",
		"flip",
		"slide",
		"overlap",
		"sameWidth",
		"fitViewport",
		"hideWhenDetached",
		"detachedPadding",
		"arrowPadding",
		"overflowPadding",
	);

	const [value, setValue] = createControllableSignal<string | undefined | null>(
		{
			value: () => mergedProps.value,
			defaultValue: () => mergedProps.defaultValue,
			onChange: (value) => mergedProps.onValueChange?.(value),
		},
	);
	const [autoFocusMenu, setAutoFocusMenu] = createControllableSignal({
		value: () => mergedProps.autoFocusMenu,
		defaultValue: () => false,
		onChange: mergedProps.onAutoFocusMenuChange,
	});

	const [viewportRef, setViewportRef] = createSignal<HTMLElement>();
	const [rootRef, setRootRef] = createSignal<HTMLElement>();

	const [currentPlacement, setCurrentPlacement] = createSignal<Placement>(
		popperProps.placement ?? others.orientation === "vertical"
			? "right"
			: "bottom",
	);

	createEffect(() => {
		setCurrentPlacement(others.orientation === "vertical" ? "right" : "bottom");
	});

	let timeoutId: number | undefined;

	const [previousMenu, setPreviousMenu] = createSignal<string>();

	const [show, setShow] = createSignal(false);
	const [expanded, setExpanded] = createSignal(false);

	createEffect(() => {
		if (value() && !value()!.includes("link-trigger-") && autoFocusMenu()) {
			setExpanded(true);
			setShow(true);
		} else {
			setExpanded(false);
			setShow(false);
		}
	});

	const dataset: Accessor<NavigationMenuDataSet> = createMemo(() => ({
		"data-expanded": expanded() ? "" : undefined,
		"data-closed": !expanded() ? "" : undefined,
	}));

	const { present: viewportPresent } = createPresence({
		show: () => mergedProps.forceMount || show() || expanded(),
		element: () => viewportRef() ?? null,
	});

	createEffect(() => {
		if (!viewportPresent()) {
			context.setPreviousMenu(undefined);
		}
	});

	const context: NavigationMenuContextValue = {
		dataset,
		delayDuration: () => mergedProps.delayDuration!,
		skipDelayDuration: () => mergedProps.skipDelayDuration!,
		autoFocusMenu: autoFocusMenu as Accessor<boolean>,
		setAutoFocusMenu,
		startLeaveTimer: () => {
			timeoutId = window.setTimeout(() => {
				context.setAutoFocusMenu(false);
				setValue(undefined);
			}, context.skipDelayDuration());
		},
		cancelLeaveTimer: () => {
			if (timeoutId) clearTimeout(timeoutId);
		},
		rootRef,
		setRootRef: setRootRef as Setter<HTMLElement>,
		viewportRef,
		setViewportRef: setViewportRef as Setter<HTMLElement>,
		viewportPresent,
		currentPlacement,
		previousMenu,
		setPreviousMenu,
	};

	return (
		<NavigationMenuContext value={context}>
			<Popper
				anchorRef={rootRef}
				contentRef={viewportRef}
				placement={currentPlacement()}
				onCurrentPlacementChange={setCurrentPlacement}
				{...popperProps}
			>
				<nav>
					<MenubarRoot<
						Component<
							Omit<NavigationMenuRootRenderProps, keyof MenubarRootRenderProps>
						>
					>
						as="ul"
						ref={mergeRefs(context.setRootRef, mergedProps.ref)}
						value={value() ?? null}
						onValueChange={setValue}
						autoFocusMenu={autoFocusMenu()}
						onAutoFocusMenuChange={setAutoFocusMenu}
						{...others}
					/>
				</nav>
			</Popper>
		</NavigationMenuContext>
	);
}
