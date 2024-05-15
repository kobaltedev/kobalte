import { callHandler, mergeDefaultProps } from "@kobalte/utils";
import { ValidComponent, splitProps, Component, createSignal, JSX } from "solid-js";
import { MenubarRootCommonProps, MenubarRootOptions, MenubarRootRenderProps } from "../menubar";
import { MenubarRoot } from "../menubar/menubar-root";

import { PolymorphicProps } from "../polymorphic";
import { NavigationMenuContext, NavigationMenuContextValue } from "./navigation-menu-context";

export interface NavigationMenuRootOptions extends MenubarRootOptions {
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
}

export interface NavigationMenuRootRenderProps extends NavigationMenuRootCommonProps, MenubarRootRenderProps {
}

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

	const [local, others] = splitProps(mergedProps, [
		"delayDuration",
		"skipDelayDuration",
	]);
	
	const [autoFocusMenu, setAutoFocusMenu] = createSignal(false);
	
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
	};

	return (
		<NavigationMenuContext.Provider value={context}>
			<MenubarRoot<Component<Omit<NavigationMenuRootRenderProps, keyof MenubarRootRenderProps>>>
				autoFocusMenu={autoFocusMenu()}
	      onAutoFocusMenuChange={setAutoFocusMenu}
				{...others}
			/>
		</NavigationMenuContext.Provider>
	);
}
