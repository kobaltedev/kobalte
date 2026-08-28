import type { ValidComponent } from "@solidjs/web";
import type { Component } from "solid-js";

import { FormControlLabel } from "../form-control/index.ts";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";

export interface TimeFieldLabelOptions {}

export interface TimeFieldLabelCommonProps<
	_T extends HTMLElement = HTMLElement,
> {}

export interface TimeFieldLabelRenderProps extends TimeFieldLabelCommonProps {}

export type TimeFieldLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TimeFieldLabelOptions & Partial<TimeFieldLabelCommonProps<ElementOf<T>>>;

export function TimeFieldLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, TimeFieldLabelProps<T>>,
) {
	return (
		<FormControlLabel<Component<TimeFieldLabelRenderProps>>
			as="span"
			{...(props as TimeFieldLabelProps)}
		/>
	);
}
