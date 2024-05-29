import { mergeRefs } from "@kobalte/utils";
import { JSX, ValidComponent, splitProps } from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";
import { usePopperContext } from "./popper-context";

export interface PopperPositionerOptions {}

export interface PopperPositionerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
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

	const [local, others] = splitProps(props as PopperPositionerProps, [
		"ref",
		"style",
	]);

	return (
		<Polymorphic<PopperPositionerRenderProps>
			as="div"
			ref={mergeRefs(context.setPositionerRef, local.ref)}
			data-popper-positioner=""
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				"min-width": "max-content",
				...local.style,
			}}
			{...others}
		/>
	);
}
