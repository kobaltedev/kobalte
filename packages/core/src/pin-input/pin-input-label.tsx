import type { Component, ValidComponent } from "solid-js";

import { FormControlLabel } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

export interface PinInputLabelOptions {}

export interface PinInputLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface PinInputLabelRenderProps extends PinInputLabelCommonProps {}

export type PinInputLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PinInputLabelOptions & Partial<PinInputLabelCommonProps<ElementOf<T>>>;

export function PinInputLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, PinInputLabelProps<T>>,
) {
	return (
		<FormControlLabel<Component<PinInputLabelRenderProps>>
			as="span"
			{...(props as PinInputLabelProps)}
		/>
	);
}
