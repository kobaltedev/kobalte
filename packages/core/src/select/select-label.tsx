import { callHandler } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";

import {
	FormControlLabel,
	type FormControlLabelCommonProps,
	type FormControlLabelRenderProps,
} from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useSelectContext } from "./select-context";

export interface SelectLabelOptions {}

export interface SelectLabelCommonProps<T extends HTMLElement = HTMLElement>
	extends FormControlLabelCommonProps<T> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface SelectLabelRenderProps
	extends SelectLabelCommonProps,
		FormControlLabelRenderProps {}

export type SelectLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SelectLabelOptions & Partial<SelectLabelCommonProps<ElementOf<T>>>;

/**
 * The label that gives the user information on the select.
 */
export function SelectLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, SelectLabelProps<T>>,
) {
	const context = useSelectContext();

	const [local, others] = splitProps(props as SelectLabelProps, ["onClick"]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		if (!context.isDisabled()) {
			context.triggerRef()?.focus();
		}
	};

	return (
		<FormControlLabel<
			Component<Omit<SelectLabelRenderProps, keyof FormControlLabelRenderProps>>
		>
			as="span"
			onClick={onClick}
			{...others}
		/>
	);
}
