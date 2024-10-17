import { EventKey, callHandler, mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent, splitProps } from "solid-js";

import type {
	CheckboxControlCommonProps,
	CheckboxControlOptions,
	CheckboxControlProps,
	CheckboxControlRenderProps,
} from "../checkbox";
import { useFormControlContext } from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type CheckboxGroupItemDataSet,
	useCheckboxGroupItemContext,
} from "./checkbox-group-item-context";

export interface CheckboxGroupItemControlOptions
	extends CheckboxControlOptions {}

export interface CheckboxGroupItemControlCommonProps
	extends CheckboxControlCommonProps {}

export interface CheckboxGroupItemControlRenderProps
	extends CheckboxControlRenderProps {}

export interface CheckboxGroupItemControlRenderProps
	extends CheckboxControlRenderProps,
		CheckboxGroupItemControlCommonProps,
		CheckboxGroupItemDataSet {}

export type CheckboxGroupItemControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxControlProps;

/**
 * The element that visually represents a checkbox group item.
 */
export function CheckboxGroupItemControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxGroupItemControlProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useCheckboxGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("control"),
		},
		props as CheckboxGroupItemControlProps,
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
		<Polymorphic<CheckboxGroupItemControlRenderProps>
			as="div"
			onClick={onClick}
			onKeyDown={onKeyDown}
			{...formControlContext.dataset()}
			{...context.dataset()}
			{...others}
		/>
	);
}
