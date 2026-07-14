import type { JSX, ValidComponent } from "solid-js";

import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control/index.ts";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useColorWheelContext } from "./color-wheel-context.tsx";

export interface ColorWheelValueLabelOptions {}

export interface ColorWheelValueLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface ColorWheelValueLabelRenderProps
	extends ColorWheelValueLabelCommonProps,
		FormControlDataSet {
	children: JSX.Element;
}

export type ColorWheelValueLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorWheelValueLabelOptions &
	Partial<ColorWheelValueLabelCommonProps<ElementOf<T>>>;

export function ColorWheelValueLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorWheelValueLabelProps<T>>,
) {
	const context = useColorWheelContext();
	const formControlContext = useFormControlContext();

	return (
		<Polymorphic<ColorWheelValueLabelRenderProps>
			as="div"
			{...formControlContext.dataset()}
			{...(props as ColorWheelValueLabelProps)}
		>
			{context.getValueLabel(context.state.value())}
		</Polymorphic>
	);
}
