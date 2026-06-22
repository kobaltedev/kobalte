import { mergeRefs } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { usePopperContext } from "./popper-context";

export interface PopperPositionerOptions {}

export interface PopperPositionerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
	style?: JSX.CSSProperties | string;
}

export interface PopperPositionerRenderProps
	extends PopperPositionerCommonProps {
	"data-popper-positioner": "";
}

export type PopperPositionerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PopperPositionerOptions &
	Partial<PopperPositionerCommonProps<ElementOf<T>>>;

/**
 * The wrapper component that positions the popper content relative to the popper anchor.
 */
export function PopperPositioner<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PopperPositionerProps<T>>,
) {
	const context = usePopperContext();

	const others = omit(props as PopperPositionerProps, "ref", "style");

	return (
		<Polymorphic<PopperPositionerRenderProps>
			as="div"
			ref={mergeRefs(context.setPositionerRef, props.ref as (el: HTMLElement) => void)}
			data-popper-positioner=""
			style={combineStyle(
				{
					position: "absolute",
					top: 0,
					left: 0,
					"min-width": "max-content",
				},
				props.style,
			)}
			{...others}
		/>
	);
}
