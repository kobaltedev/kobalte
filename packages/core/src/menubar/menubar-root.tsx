/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/ea6376900d54af536dbb7b71b4fefd6ec2ce9dc0/packages/react/menubar/src/Menubar.tsx
 */

import {
	OverrideComponentProps,
	contains,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	Accessor,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	splitProps,
} from "solid-js";
import { isServer } from "solid-js/web";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { createControllableSignal, createInteractOutside } from "../primitives";
import {
	MenubarContext,
	MenubarContextValue,
	MenubarDataSet,
} from "./menubar-context";

export interface MenubarRootOptions extends AsChildProp {
	/** The value of the menu that should be open when initially rendered. Use when you do not need to control the value state. */
	defaultValue?: string;

	/** The controlled value of the menu to open. Should be used in conjunction with onValueChange. */
	value?: string;

	/** Event handler called when the value changes. */
	onValueChange?: (value: string | undefined) => void;

	/** When true, keyboard navigation will loop from last item to first, and vice versa. (default: true) */
	loop?: boolean;

	/** When true, click on alt by itsef will focus this Menubar (some browsers interfere) */
	focusOnAlt?: boolean;
}

export interface MenubarRootProps
	extends OverrideComponentProps<"div", MenubarRootOptions> {}

/**
 * A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
 */
export function MenubarRoot(props: MenubarRootProps) {
	let ref: HTMLDivElement | undefined;
	const defaultId = `menubar-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps({ id: defaultId, loop: true }, props);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"value",
		"defaultValue",
		"onValueChange",
		"loop",
		"focusOnAlt",
	]);

	const [value, setValue] = createControllableSignal<string | undefined>({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: (value) => local.onValueChange?.(value),
	});

	const [lastValue, setLastValue] = createSignal<string | undefined>();

	const [menuRefs, setMenuRefs] = createSignal<Map<string, Array<Element>>>(
		new Map<string, Array<HTMLElement>>(),
	);

	const dataset: Accessor<MenubarDataSet> = createMemo(() => ({
		"data-expanded": value() !== undefined ? "" : undefined,
		"data-closed": value() === undefined ? "" : undefined,
	}));

	const [autoFocusMenu, setAutoFocusMenu] = createSignal(false);

	const context: MenubarContextValue = {
		dataset,
		value,
		setValue,
		lastValue,
		setLastValue,
		menus: () => new Set([...menuRefs().keys()]),
		menuRefs: () => [...menuRefs().values()].flat(),
		registerMenu: (value, refs) => {
			setMenuRefs((prev) => {
				prev.set(value, refs);
				return prev;
			});
		},
		unregisterMenu: (value: string) => {
			setMenuRefs((prev) => {
				prev.delete(value);
				return prev;
			});
		},
		nextMenu: () => {
			const menusArray = [...menuRefs().keys()];

			if (value() === undefined) {
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

			if (value() === undefined) {
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
		autoFocusMenu,
		setAutoFocusMenu,
		generateId: createGenerateId(() => others.id!),
	};
	createInteractOutside(
		{
			onInteractOutside: () => {
				context.closeMenu();
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
	});

	createEffect(() => {
		if (value() !== undefined) setLastValue(value());
	});

	onCleanup(() => {
		if (isServer) return;
		window.removeEventListener("keydown", keydownHandler);
	});

	return (
		<MenubarContext.Provider value={context}>
			<Polymorphic
				as="div"
				ref={mergeRefs((el) => (ref = el), local.ref)}
				{...others}
				role="menubar"
				data-orientation="horizontal"
			/>
		</MenubarContext.Provider>
	);
}
