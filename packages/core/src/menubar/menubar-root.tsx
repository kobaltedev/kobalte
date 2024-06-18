/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/ea6376900d54af536dbb7b71b4fefd6ec2ce9dc0/packages/react/menubar/src/Menubar.tsx
 */

import {
	type Orientation,
	OverrideComponentProps,
	contains,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Accessor,
	type Setter,
	type ValidComponent,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	splitProps,
} from "solid-js";
import { isServer } from "solid-js/web";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createControllableSignal, createInteractOutside } from "../primitives";
import {
	MenubarContext,
	type MenubarContextValue,
	type MenubarDataSet,
} from "./menubar-context";

export interface MenubarRootOptions {
	/** The value of the menu that should be open when initially rendered. Use when you do not need to control the value state. */
	defaultValue?: string;

	/** The controlled value of the menu to open. Should be used in conjunction with onValueChange. */
	value?: string | null;

	/** Event handler called when the value changes. */
	onValueChange?: (value: string | undefined | null) => void;

	/** When true, keyboard navigation will loop from last item to first, and vice versa. (default: true) */
	loop?: boolean;

	/** When true, click on alt by itsef will focus this Menubar (some browsers interfere) */
	focusOnAlt?: boolean;

	/** The orientation of the menubar. */
	orientation?: Orientation;

	autoFocusMenu?: boolean;
	onAutoFocusMenuChange?: Setter<boolean>;
}

export interface MenubarRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface MenubarRootRenderProps extends MenubarRootCommonProps {
	role: "menubar";
	"data-orientation": "horizontal" | "vertical";
	"aria-orientation": "horizontal" | "vertical";
}

export type MenubarRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenubarRootOptions & Partial<MenubarRootCommonProps<ElementOf<T>>>;

/**
 * A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
 */
export function MenubarRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenubarRootProps<T>>,
) {
	let ref: HTMLElement | undefined;
	const defaultId = `menubar-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{ id: defaultId, loop: true, orientation: "horizontal" },
		props as MenubarRootProps,
	);

	const [local, others] = splitProps(
		mergedProps as typeof mergedProps & { id: string },
		[
			"ref",
			"value",
			"defaultValue",
			"onValueChange",
			"loop",
			"focusOnAlt",
			"autoFocusMenu",
			"onAutoFocusMenuChange",
			"orientation",
		],
	);

	const [value, setValue] = createControllableSignal<string | null | undefined>(
		{
			value: () => local.value,
			defaultValue: () => local.defaultValue,
			onChange: (value) => local.onValueChange?.(value),
		},
	);

	const [lastValue, setLastValue] = createSignal<string | undefined>();

	const [menuRefs, setMenuRefs] = createSignal<Map<string, Array<HTMLElement>>>(
		new Map<string, Array<HTMLElement>>(),
	);

	const [autoFocusMenu, setAutoFocusMenu] = createControllableSignal({
		value: () => local.autoFocusMenu,
		defaultValue: () => false,
		onChange: local.onAutoFocusMenuChange,
	});

	const expanded = () => {
		return value() && autoFocusMenu() && !value()?.includes("link-trigger-");
	};

	const dataset: Accessor<MenubarDataSet> = createMemo(() => ({
		"data-expanded": expanded() ? "" : undefined,
		"data-closed": !expanded() ? "" : undefined,
	}));

	const context: MenubarContextValue = {
		dataset,
		value,
		setValue,
		lastValue,
		setLastValue,
		menus: () => new Set([...menuRefs().keys()]),
		menuRefs: () => [...menuRefs().values()].flat(),
		menuRefMap: () => menuRefs(),
		registerMenu: (value, refs) => {
			setMenuRefs((prev) => {
				const map = new Map<string, Array<HTMLElement>>();
				prev.forEach((value, key) => map.set(key, value));
				map.set(value, refs);
				return map;
			});
		},
		unregisterMenu: (value: string) => {
			setMenuRefs((prev) => {
				prev.delete(value);
				const map = new Map<string, Array<HTMLElement>>();
				prev.forEach((value, key) => map.set(key, value));
				return map;
			});
		},
		nextMenu: () => {
			const menusArray = [...menuRefs().keys()];

			if (value() == null) {
				setValue(menusArray[0]);
				return;
			}

			const currentIndex = menusArray.indexOf(value()!);

			if (currentIndex === menusArray.length - 1) {
				if (local.loop) setValue(menusArray[0]);
				return;
			}

			setValue(menusArray[currentIndex + 1]);
		},
		previousMenu: () => {
			const menusArray = [...menuRefs().keys()];

			if (value() == null) {
				setValue(menusArray[0]);
				return;
			}

			const currentIndex = menusArray.indexOf(value()!);

			if (currentIndex === 0) {
				if (local.loop) setValue(menusArray[menusArray.length - 1]);
				return;
			}

			setValue(menusArray[currentIndex - 1]);
		},
		closeMenu: () => {
			setAutoFocusMenu(false);
			setValue(undefined);
		},
		autoFocusMenu: () => autoFocusMenu()!,
		setAutoFocusMenu,
		generateId: createGenerateId(() => others.id!),
		orientation: () => local.orientation!,
	};

	createEffect(() => {
		if (value() == null) setAutoFocusMenu(false);
	});

	createInteractOutside(
		{
			onInteractOutside: () => {
				context.closeMenu();
				setTimeout(() => context.closeMenu());
			},
			shouldExcludeElement: (element) => {
				return [ref, ...menuRefs().values()]
					.flat()
					.some((ref) => contains(ref, element));
			},
		},
		() => ref,
	);

	const keydownHandler = (e: KeyboardEvent) => {
		if (e.key === "Alt") {
			e.preventDefault();
			e.stopPropagation();
			if (context.value() === undefined) context.nextMenu();
			else context.closeMenu();
		}
	};

	createEffect(() => {
		if (isServer) return;
		if (local.focusOnAlt) window.addEventListener("keydown", keydownHandler);
		else window.removeEventListener("keydown", keydownHandler);

		onCleanup(() => {
			window.removeEventListener("keydown", keydownHandler);
		});
	});

	createEffect(() => {
		if (value() != null) setLastValue(value()!);
	});

	return (
		<MenubarContext.Provider value={context}>
			<Polymorphic<MenubarRootRenderProps>
				as="div"
				ref={mergeRefs((el) => (ref = el), local.ref)}
				role="menubar"
				data-orientation={local.orientation!}
				aria-orientation={local.orientation!}
				{...others}
			/>
		</MenubarContext.Provider>
	);
}
