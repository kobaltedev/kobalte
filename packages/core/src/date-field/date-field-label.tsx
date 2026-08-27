import type { ValidComponent } from "@solidjs/web";
import type { Component } from "solid-js";

import { FormControlLabel } from "../form-control/index.ts";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";

export interface DateFieldLabelOptions {}

export interface DateFieldLabelCommonProps<
	_T extends HTMLElement = HTMLElement,
> {}

export interface DateFieldLabelRenderProps extends DateFieldLabelCommonProps {}

export type DateFieldLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DateFieldLabelOptions & Partial<DateFieldLabelCommonProps<ElementOf<T>>>;

export function DateFieldLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, DateFieldLabelProps<T>>,
) {
	return (
		<FormControlLabel<Component<DateFieldLabelRenderProps>>
			as="span"
			{...(props as DateFieldLabelProps)}
		/>
	);
}
