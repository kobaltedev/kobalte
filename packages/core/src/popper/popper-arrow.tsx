/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/b6c7f8cf609db32e64c8d4b28b5e06ebf437a800/packages/ariakit/src/popover/popover-arrow.tsx
 * https://github.com/ariakit/ariakit/blob/a178c2f2dcc6571ba338fd74c79e3b0eab2a27c5/packages/ariakit/src/popover/__popover-arrow-path.ts
 */

import { combineStyle } from "@solid-primitives/props";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	createEffect,
	createSignal,
	merge,
	omit,
	type Ref,
} from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { usePopperContext } from "./popper-context.tsx";
import type { BasePlacement } from "./utils.ts";

const DEFAULT_SIZE = 30;
const HALF_DEFAULT_SIZE = DEFAULT_SIZE / 2;

const ROTATION_DEG = {
	top: 180,
	right: -90,
	bottom: 0,
	left: 90,
} as const;

export const ARROW_PATH =
	"M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z";

export interface PopperArrowOptions {
	/** The size of the arrow. */
	size?: number;
}

export interface PopperArrowCommonProps<T extends HTMLElement = HTMLElement> {
	ref: Ref<T>;
	style?: JSX.CSSProperties | string;
}

export interface PopperArrowRenderProps extends PopperArrowCommonProps {
	children: JSX.Element;
	"aria-hidden": "true";
}

export type PopperArrowProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PopperArrowOptions & Partial<PopperArrowCommonProps<ElementOf<T>>>;

/**
 * An optional arrow element to render alongside the popper content.
 * Must be rendered in the popper content.
 */
export function PopperArrow<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PopperArrowProps<T>>,
) {
	const context = usePopperContext();

	const mergedProps = merge(
		{
			size: DEFAULT_SIZE,
		},
		props as PopperArrowProps,
	);

	const others = omit(mergedProps, "ref", "style", "size");

	const dir = () => context.currentPlacement().split("-")[0] as BasePlacement;
	const contentStyle = createComputedStyle(context.contentRef);
	const fill = () =>
		contentStyle()?.getPropertyValue("background-color") || "none";
	const stroke = () =>
		contentStyle()?.getPropertyValue(`border-${dir()}-color`) || "none";
	const borderWidth = () =>
		contentStyle()?.getPropertyValue(`border-${dir()}-width`) || "0px";
	const strokeWidth = () => {
		return (
			Number.parseInt(borderWidth(), 10) *
			2 *
			(DEFAULT_SIZE / mergedProps.size!)
		);
	};
	const rotate = () => {
		return `rotate(${
			ROTATION_DEG[dir()]
		} ${HALF_DEFAULT_SIZE} ${HALF_DEFAULT_SIZE}) translate(0 2)`;
	};

	return (
		<Polymorphic<PopperArrowRenderProps>
			as="div"
			ref={[context.setArrowRef, mergedProps.ref]}
			aria-hidden="true"
			style={combineStyle(
				{
					// server side rendering
					position: "absolute",
					"font-size": `${mergedProps.size!}px`,
					width: "1em",
					height: "1em",
					"pointer-events": "none",
					fill: fill(),
					stroke: stroke(),
					"stroke-width": strokeWidth(),
				} as JSX.CSSProperties,
				mergedProps.style,
			)}
			{...others}
		>
			<svg
				display="block"
				viewBox={`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`}
				style="transform:scale(1.02)"
			>
				<g transform={rotate()}>
					<path fill="none" d={ARROW_PATH} />
					<path stroke="none" d={ARROW_PATH} />
				</g>
			</svg>
		</Polymorphic>
	);
}

function createComputedStyle(element: Accessor<Element | undefined>) {
	const [style, setStyle] = createSignal<CSSStyleDeclaration>();

	createEffect(
		() => element(),
		(el) => {
			if (el) setStyle((el.ownerDocument.defaultView ?? window).getComputedStyle(el));
		},
	);

	return style;
}
