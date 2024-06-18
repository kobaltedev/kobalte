import { type JSX, type ValidComponent, splitProps } from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressFillOptions {}

export interface ProgressFillCommonProps<T extends HTMLElement = HTMLElement> {
	style?: JSX.CSSProperties | string;
}

export interface ProgressFillRenderProps
	extends ProgressFillCommonProps,
		ProgressDataSet {}

export type ProgressFillProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ProgressFillOptions & Partial<ProgressFillCommonProps<ElementOf<T>>>;

/**
 * The component that visually represents the progress value.
 * Used to visually show the fill of `Progress.Track`.
 */
export function ProgressFill<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ProgressFillProps<T>>,
) {
	const context = useProgressContext();

	const [local, others] = splitProps(props as ProgressFillProps, ["style"]);

	return (
		<Polymorphic<ProgressFillRenderProps>
			as="div"
			style={combineStyle(
				{
					"--kb-progress-fill-width": context.progressFillWidth(),
				},
				local.style,
			)}
			{...context.dataset()}
			{...others}
		/>
	);
}
