import {
	createGenerateId,
	mergeDefaultProps,
	type Orientation,
} from "@kobalte/utils";
import { createUniqueId, omit, type ParentProps } from "solid-js";

import { useOptionalMenubarContext } from "../menubar/menubar-context";
import { createDisclosureState } from "../primitives";
import { Menu, type MenuOptions } from "./menu";
import {
	MenuRootContext,
	type MenuRootContextValue,
} from "./menu-root-context";

export interface MenuRootOptions extends MenuOptions {
	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * Whether the menu should be the only visible content for screen readers.
	 * When set to `true`:
	 * - interaction with outside elements will be disabled.
	 * - scroll will be locked.
	 * - focus will be locked inside the menu content.
	 * - elements outside the menu content will not be visible for screen readers.
	 */
	modal?: boolean;

	/** Whether the scroll should be locked even if the menu is not modal. */
	preventScroll?: boolean;

	/**
	 * Used to force mounting the menu (portal, positioner and content) when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;

	/** The orientation of the menu. */
	orientation?: Orientation;

	/**
	 * A unique value that associates the item with an active value
	 * when the navigation menu is controlled.
	 * This prop is managed automatically when uncontrolled.
	 * Only used inside a Menubar.
	 */
	value?: string;
}

export interface MenuRootProps extends ParentProps<MenuRootOptions> {}

/**
 * Root component for a menu, provide context for its children.
 * Used to build dropdown menu, context menu and menubar.
 */
export function MenuRoot(props: MenuRootProps) {
	const optionalMenubarContext = useOptionalMenubarContext();

	const defaultId = `menu-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			modal: true,
		},
		props,
	);

	const others = omit(
		mergedProps,
		"id",
		"modal",
		"preventScroll",
		"forceMount",
		"open",
		"defaultOpen",
		"onOpenChange",
		"value",
		"orientation",
	);

	const disclosureState = createDisclosureState({
		open: () => mergedProps.open,
		defaultOpen: () => mergedProps.defaultOpen,
		onOpenChange: (isOpen) => mergedProps.onOpenChange?.(isOpen),
	});

	const context: MenuRootContextValue = {
		isModal: () => mergedProps.modal ?? true,
		preventScroll: () => mergedProps.preventScroll ?? context.isModal(),
		forceMount: () => mergedProps.forceMount ?? false,
		generateId: createGenerateId(() => mergedProps.id!),
		value: () => mergedProps.value,
		orientation: () =>
			mergedProps.orientation ??
			optionalMenubarContext?.orientation() ??
			"horizontal",
	};

	return (
		<MenuRootContext value={context}>
			<Menu
				open={disclosureState.isOpen()}
				onOpenChange={disclosureState.setIsOpen}
				{...others}
			/>
		</MenuRootContext>
	);
}
