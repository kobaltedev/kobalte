import { EventKey, callHandler, mergeDefaultProps } from "@kobalte/utils";
import { JSX, ValidComponent, splitProps } from "solid-js";

import { FormControlDataSet, useFormControlContext } from "../form-control";
import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxControlOptions {}

export interface CheckboxControlCommonProps {
	id: string;
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>;
}

export interface CheckboxControlRenderProps
	extends CheckboxControlCommonProps,
		FormControlDataSet,
		CheckboxDataSet {}

export type CheckboxControlProps = CheckboxControlOptions &
	Partial<CheckboxControlCommonProps>;

/**
 * The element that visually represents a checkbox.
 */
export function CheckboxControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxControlProps>,
) {
	const formControlContext = useFormControlContext();
	const context = useCheckboxContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("control"),
		},
		props as CheckboxControlProps,
	);

	const [local, others] = splitProps(mergedProps, ["onClick", "onKeyDown"]);

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		context.toggle();
		context.inputRef()?.focus();
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		if (e.key === EventKey.Space) {
			context.toggle();
			context.inputRef()?.focus();
		}
	};

	return (
		<Polymorphic<CheckboxControlRenderProps>
			as="div"
			onClick={onClick}
			onKeyDown={onKeyDown}
			{...formControlContext.dataset()}
			{...context.dataset()}
			{...others}
		/>
	);
}
