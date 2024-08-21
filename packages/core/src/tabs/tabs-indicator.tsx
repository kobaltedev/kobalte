/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/703ab7b4559ecd4fc611e7f2c0e758867990fe01/packages/@react-spectrum/tabs/src/Tabs.tsx
 */
import {
	type JSX,
	type ValidComponent,
	createEffect,
	createSignal,
	on,
	onMount,
	splitProps,
} from "solid-js";

import type { Orientation } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import { createResizeObserver } from "@solid-primitives/resize-observer";
import { useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useTabsContext } from "./tabs-context";

export interface TabsIndicatorOptions {}

export interface TabsIndicatorCommonProps<T extends HTMLElement = HTMLElement> {
	style?: JSX.CSSProperties | string;
}

export interface TabsIndicatorRenderProps extends TabsIndicatorCommonProps {
	role: "presentation";
	"data-orientation": Orientation;
}

export type TabsIndicatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TabsIndicatorOptions & Partial<TabsIndicatorCommonProps<ElementOf<T>>>;

/**
 * The visual indicator displayed at the bottom of the tab list to indicate the selected tab.
 * It provides the base style needed to display a smooth transition to the new selected tab.
 */
export function TabsIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TabsIndicatorProps<T>>,
) {
	const context = useTabsContext();

	const [local, others] = splitProps(props as TabsIndicatorProps, ["style"]);

	const [style, setStyle] = createSignal<JSX.CSSProperties>({
		width: undefined,
		height: undefined,
	});

	const { direction } = useLocale();

	const computeStyle = () => {
		const selectedTab = context.selectedTab();

		if (selectedTab == null) {
			return;
		}

		const styleObj: JSX.CSSProperties = {
			transform: undefined,
			width: undefined,
			height: undefined,
		};

		// In RTL, calculate the transform from the right edge of the tab list
		// so that resizing the window doesn't break the TabIndicator position due to offsetLeft changes
		const offset =
			direction() === "rtl"
				? -1 *
					((selectedTab.offsetParent as HTMLElement)?.offsetWidth -
						selectedTab.offsetWidth -
						selectedTab.offsetLeft)
				: selectedTab.offsetLeft;

		styleObj.transform =
			context.orientation() === "vertical"
				? `translateY(${selectedTab.offsetTop}px)`
				: `translateX(${offset}px)`;

		if (context.orientation() === "horizontal") {
			styleObj.width = `${selectedTab.offsetWidth}px`;
		} else {
			styleObj.height = `${selectedTab.offsetHeight}px`;
		}

		setStyle(styleObj);
	};

	// For the first run, wait for all tabs to be mounted and registered in tabs DOM collection
	// before computing the style.
	onMount(() => {
		queueMicrotask(() => {
			computeStyle();
		});
	});

	// Compute style normally for subsequent runs.
	createEffect(
		on(
			[context.selectedTab, context.orientation, direction],
			() => {
				computeStyle();
			},
			{ defer: true },
		),
	);

	const [resizing, setResizing] = createSignal(false);

	let timeout: NodeJS.Timeout | null = null;
	let prevTarget: any = null;
	createResizeObserver(context.selectedTab, (_, t) => {
		if (prevTarget !== t) {
			prevTarget = t;
			return;
		}

		setResizing(true);

		if (timeout) clearTimeout(timeout);

		// gives the browser a chance to skip any animations that are disabled while resizing
		timeout = setTimeout(() => {
			timeout = null;
			setResizing(false);
		}, 1);

		computeStyle();
	});

	return (
		<Polymorphic<TabsIndicatorRenderProps>
			as="div"
			role="presentation"
			style={combineStyle(style(), local.style)}
			data-orientation={context.orientation()}
			data-resizing={resizing()}
			{...others}
		/>
	);
}
