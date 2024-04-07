import { callHandler } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";

import {
	FormControlLabel,
	FormControlLabelCommonProps,
	FormControlLabelRenderProps,
} from "../form-control";
import { PolymorphicProps } from "../polymorphic";
import { useSelectContext } from "./select-context";

export interface SelectLabelOptions {}

export interface SelectLabelCommonProps extends FormControlLabelCommonProps {
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
}

export interface SelectLabelRenderProps
	extends SelectLabelCommonProps,
		FormControlLabelRenderProps {}

export type SelectLabelProps = SelectLabelOptions &
	Partial<SelectLabelCommonProps>;

/**
 * The label that gives the user information on the select.
 */
export function SelectLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, SelectLabelProps>,
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
