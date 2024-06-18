import { EventKey, callHandler, mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent, splitProps } from "solid-js";

import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxControlOptions {}

export interface CheckboxControlCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface CheckboxControlRenderProps
	extends CheckboxControlCommonProps,
		FormControlDataSet,
		CheckboxDataSet {}

export type CheckboxControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxControlOptions & Partial<CheckboxControlCommonProps<ElementOf<T>>>;

/**
 * The element that visually represents a checkbox.
 */
export function CheckboxControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxControlProps<T>>,
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
