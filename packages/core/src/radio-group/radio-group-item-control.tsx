import { EventKey, callHandler, mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type RadioGroupItemDataSet,
	useRadioGroupItemContext,
} from "./radio-group-item-context";

export interface RadioGroupItemControlOptions {}

export interface RadioGroupItemControlCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface RadioGroupItemControlRenderProps
	extends RadioGroupItemControlCommonProps,
		RadioGroupItemDataSet {}

export type RadioGroupItemControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RadioGroupItemControlOptions &
	Partial<RadioGroupItemControlCommonProps<ElementOf<T>>>;

/**
 * The element that visually represents a radio button.
 */
export function RadioGroupItemControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioGroupItemControlProps<T>>,
) {
	const context = useRadioGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("control"),
		},
		props as RadioGroupItemControlProps,
	);

	const others = omit(mergedProps, "onClick", "onKeyDown");

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, mergedProps.onClick);

		context.select();
		context.inputRef()?.focus();
	};

	const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown);

		if (e.key === EventKey.Space) {
			context.select();
			context.inputRef()?.focus();
		}
	};

	return (
		<Polymorphic<RadioGroupItemControlRenderProps>
			as="div"
			onClick={onClick}
			onKeyDown={onKeyDown}
			{...context.dataset()}
			{...others}
		/>
	);
}
