import { EventKey, callHandler, mergeDefaultProps } from "@kobalte/utils";
import { JSX, ValidComponent, splitProps } from "solid-js";

import { FormControlDataSet, useFormControlContext } from "../form-control";
import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { SwitchDataSet, useSwitchContext } from "./switch-context";

export interface SwitchControlOptions {}

export interface SwitchControlCommonProps {
	id: string;
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>;
}

export interface SwitchControlRenderProps
	extends SwitchControlCommonProps,
		FormControlDataSet,
		SwitchDataSet {}

export type SwitchControlProps = SwitchControlOptions &
	Partial<SwitchControlCommonProps>;

/**
 * The element that visually represents a switch.
 */
export function SwitchControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SwitchControlProps>,
) {
	const formControlContext = useFormControlContext();
	const context = useSwitchContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("control"),
		},
		props as SwitchControlProps,
	);

	const [local, others] = splitProps(mergedProps, ["onClick", "onKeyDown"]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		context.toggle();
		context.inputRef()?.focus();
	};

	const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		if (e.key === EventKey.Space) {
			context.toggle();
			context.inputRef()?.focus();
		}
	};

	return (
		<Polymorphic<SwitchControlRenderProps>
			as="div"
			onClick={onClick}
			onKeyDown={onKeyDown}
			{...formControlContext.dataset()}
			{...context.dataset()}
			{...others}
		/>
	);
}
