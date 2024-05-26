import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	Component,
	JSX,
	Setter,
	ValidComponent,
	createSignal,
	splitProps,
} from "solid-js";
import {
	MenubarRootCommonProps,
	MenubarRootOptions,
	MenubarRootRenderProps,
} from "../menubar";
import { MenubarRoot } from "../menubar/menubar-root";

import { PolymorphicProps } from "../polymorphic";
import { Popper, PopperRootOptions } from "../popper";
import { Placement } from "../popper/utils";
import {
	NavigationMenuContext,
	NavigationMenuContextValue,
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
}

export interface NavigationMenuRootCommonProps extends MenubarRootCommonProps {
	ref: HTMLElement | ((el: HTMLElement) => void);
}

export interface NavigationMenuRootRenderProps
	extends NavigationMenuRootCommonProps,
		MenubarRootRenderProps {}

export type NavigationMenuRootProps = NavigationMenuRootOptions &
	Partial<NavigationMenuRootCommonProps>;

/**
 * A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
 */
export function NavigationMenuRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, NavigationMenuRootProps>,
) {
	const mergedProps = mergeDefaultProps(
		{
			delayDuration: 200,
			skipDelayDuration: 300,
		},
		props as NavigationMenuRootProps,
	);

	const [local, popperProps, others] = splitProps(
		mergedProps,
		["ref", "delayDuration", "skipDelayDuration"],
		[
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
		],
	);

	const [autoFocusMenu, setAutoFocusMenu] = createSignal(false);
	const [viewportRef, setViewportRef] = createSignal<HTMLElement>();
	const [rootRef, setRootRef] = createSignal<HTMLElement>();

	const [currentPlacement, setCurrentPlacement] = createSignal<Placement>(
		popperProps.placement!,
	);

	let timeoutId: number | undefined;

	const context: NavigationMenuContextValue = {
		delayDuration: () => local.delayDuration,
		skipDelayDuration: () => local.skipDelayDuration,
		autoFocusMenu,
		setAutoFocusMenu,
		startLeaveTimer: () => {
			timeoutId = window.setTimeout(() => {
				context.setAutoFocusMenu(false);
			}, context.skipDelayDuration());
		},
		cancelLeaveTimer: () => {
			if (timeoutId) clearTimeout(timeoutId);
		},
		rootRef,
		setRootRef: setRootRef as Setter<HTMLElement>,
		viewportRef,
		setViewportRef: setViewportRef as Setter<HTMLElement>,
		currentPlacement,
	};

	return (
		<NavigationMenuContext.Provider value={context}>
			<Popper
				anchorRef={rootRef}
				contentRef={viewportRef}
				onCurrentPlacementChange={setCurrentPlacement}
				{...popperProps}
			>
				<MenubarRoot<
					Component<
						Omit<NavigationMenuRootRenderProps, keyof MenubarRootRenderProps>
					>
				>
					ref={mergeRefs(context.setRootRef, local.ref)}
					autoFocusMenu={autoFocusMenu()}
					onAutoFocusMenuChange={setAutoFocusMenu}
					{...others}
				/>
			</Popper>
		</NavigationMenuContext.Provider>
	);
}
