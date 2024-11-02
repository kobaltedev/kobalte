import { type JSX, type ValidComponent, splitProps } from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type MeterDataSet, useMeterContext } from "./meter-context";

export interface MeterFillOptions {}

export interface MeterFillCommonProps<T extends HTMLElement = HTMLElement> {
	style?: JSX.CSSProperties | string;
}

export interface MeterFillRenderProps
	extends MeterFillCommonProps,
		MeterDataSet {}

export type MeterFillProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MeterFillOptions & Partial<MeterFillCommonProps<ElementOf<T>>>;

/**
 * The component that visually represents the meter value.
 * Used to visually show the fill of `Meter.Track`.
 */
export function MeterFill<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MeterFillProps<T>>,
) {
	const context = useMeterContext();

	const [local, others] = splitProps(props as MeterFillProps, ["style"]);

	return (
		<Polymorphic<MeterFillRenderProps>
			as="div"
			style={combineStyle(
				{
					"--kb-meter-fill-width": context.meterFillWidth(),
				},
				local.style,
			)}
			{...context.dataset()}
			{...others}
		/>
	);
}
