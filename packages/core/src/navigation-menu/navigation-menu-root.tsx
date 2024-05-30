import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	Accessor,
	Component,
	JSX,
	Setter,
	ValidComponent,
	createEffect,
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
import { createControllableSignal } from "../primitives/create-controllable-signal";
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

	/** The value of the menu that should be open when initially rendered. Use when you do not need to control the value state. */
	defaultValue?: string;

	/** The controlled value of the menu to open. Should be used in conjunction with onValueChange. */
	value?: string | null;

	/** Event handler called when the value changes. */
	onValueChange?: (value: string | undefined | null) => void;

	autoFocusMenu?: boolean;
	onAutoFocusMenuChange?: Setter<boolean>;
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
		[
			"ref",
			"delayDuration",
			"skipDelayDuration",
			"autoFocusMenu",
			"onAutoFocusMenuChange",
			"defaultValue",
			"value",
			"onValueChange",
		],
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

	const [value, setValue] = createControllableSignal<string | undefined | null>(
		{
			value: () => local.value,
			defaultValue: () => local.defaultValue,
			onChange: (value) => local.onValueChange?.(value),
		},
	);
	const [autoFocusMenu, setAutoFocusMenu] = createControllableSignal({
		value: () => local.autoFocusMenu,
		defaultValue: () => false,
		onChange: local.onAutoFocusMenuChange,
	});

	const [viewportRef, setViewportRef] = createSignal<HTMLElement>();
	const [rootRef, setRootRef] = createSignal<HTMLElement>();

	const [currentPlacement, setCurrentPlacement] = createSignal<Placement>(
		popperProps.placement!,
	);

	let timeoutId: number | undefined;

	createEffect((prev) => {
		return value();
	});

	const context: NavigationMenuContextValue = {
		delayDuration: () => local.delayDuration,
		skipDelayDuration: () => local.skipDelayDuration,
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
					value={value() ?? null}
					onValueChange={setValue}
					autoFocusMenu={autoFocusMenu()}
					onAutoFocusMenuChange={setAutoFocusMenu}
					{...others}
				/>
			</Popper>
		</NavigationMenuContext.Provider>
	);
}
