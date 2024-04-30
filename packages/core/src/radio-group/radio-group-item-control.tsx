import { EventKey, callHandler, mergeDefaultProps } from "@kobalte/utils";
import { JSX, ValidComponent, splitProps } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import {
	RadioGroupItemDataSet,
	useRadioGroupItemContext,
} from "./radio-group-item-context";

export interface RadioGroupItemControlOptions {}

export interface RadioGroupItemControlCommonProps {
	id: string;
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>;
}

export interface RadioGroupItemControlRenderProps
	extends RadioGroupItemControlCommonProps,
		RadioGroupItemDataSet {}

export type RadioGroupItemControlProps = RadioGroupItemControlOptions &
	Partial<RadioGroupItemControlCommonProps>;

/**
 * The element that visually represents a radio button.
 */
export function RadioGroupItemControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioGroupItemControlProps>,
) {
	const context = useRadioGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("control"),
		},
		props as RadioGroupItemControlProps,
	);

	const [local, others] = splitProps(mergedProps, ["onClick", "onKeyDown"]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		context.select();
		context.inputRef()?.focus();
	};

	const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

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
