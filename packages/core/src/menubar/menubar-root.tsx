/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/ea6376900d54af536dbb7b71b4fefd6ec2ce9dc0/packages/react/menubar/src/Menubar.tsx
 */

import { contains, createGenerateId, type Orientation } from "@kobalte/utils";
import { interactOutside } from "@solid-primitives/interaction";
import { isServer, type ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	merge,
	omit,
	type Ref,
	type Setter,
} from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { createControllableSignal } from "../primitives/index.ts";
import {
	MenubarContext,
	type MenubarContextValue,
	type MenubarDataSet,
} from "./menubar-context.tsx";

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
	ref: Ref<T>;
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
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});
	const defaultId = `menubar-${createUniqueId()}`;

	const mergedProps = merge(
		{ id: defaultId, loop: true, orientation: "horizontal" } as const,
		props as MenubarRootProps,
	);

	const others = omit(
		mergedProps as typeof mergedProps & { id: string },
		"ref",
		"value",
		"defaultValue",
		"onValueChange",
		"loop",
		"focusOnAlt",
		"autoFocusMenu",
		"onAutoFocusMenuChange",
		"orientation",
	);

	const [value, setValue] = createControllableSignal<string | null | undefined>(
		{
			value: () => mergedProps.value,
			defaultValue: () => mergedProps.defaultValue,
			onChange: (value) => mergedProps.onValueChange?.(value),
		},
	);

	const [lastValue, setLastValue] = createSignal<string | undefined>(
		undefined,
		{ ownedWrite: true },
	);

	const [menuRefs, setMenuRefs] = createSignal<Map<string, Array<HTMLElement>>>(
		new Map<string, Array<HTMLElement>>(),
	);

	const [autoFocusMenu, setAutoFocusMenu] = createControllableSignal({
		value: () => mergedProps.autoFocusMenu,
		defaultValue: () => false,
		onChange: mergedProps.onAutoFocusMenuChange,
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
				for (const [key, val] of prev) {
					map.set(key, val);
				}
				map.set(value, refs);
				return map;
			});
		},
		unregisterMenu: (value: string) => {
			setMenuRefs((prev) => {
				prev.delete(value);
				const map = new Map<string, Array<HTMLElement>>();
				for (const [key, val] of prev) {
					map.set(key, val);
				}
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
				if (mergedProps.loop) setValue(menusArray[0]);
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
				if (mergedProps.loop) setValue(menusArray[menusArray.length - 1]);
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
		orientation: () => mergedProps.orientation!,
	};

	createEffect(
		() => value(),
		(val) => {
			if (val == null) setAutoFocusMenu(false);
		},
	);

	const interactOutsideRef = interactOutside({
		onInteractOutside: () => {
			context.closeMenu();
			setTimeout(() => context.closeMenu());
		},
		shouldExcludeElement: (element) => {
			return [ref(), ...menuRefs().values()]
				.flat()
				.some((ref) => contains(ref, element));
		},
	});

	const keydownHandler = (e: KeyboardEvent) => {
		if (e.key === "Alt") {
			e.preventDefault();
			e.stopPropagation();
			if (context.value() === undefined) context.nextMenu();
			else context.closeMenu();
		}
	};

	createEffect(
		() => mergedProps.focusOnAlt,
		(focusOnAlt) => {
			if (isServer) return;
			if (focusOnAlt) window.addEventListener("keydown", keydownHandler);
			else window.removeEventListener("keydown", keydownHandler);
			return () => window.removeEventListener("keydown", keydownHandler);
		},
	);

	createEffect(
		() => value(),
		(val) => {
			if (val != null) setLastValue(val!);
		},
	);

	return (
		<MenubarContext value={context}>
			<Polymorphic<MenubarRootRenderProps>
				as="div"
				ref={[interactOutsideRef, setRef, mergedProps.ref] as any}
				role="menubar"
				data-orientation={mergedProps.orientation!}
				aria-orientation={mergedProps.orientation!}
				{...others}
			/>
		</MenubarContext>
	);
}
