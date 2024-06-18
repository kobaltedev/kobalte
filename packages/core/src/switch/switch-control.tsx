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
import { type SwitchDataSet, useSwitchContext } from "./switch-context";

export interface SwitchControlOptions {}

export interface SwitchControlCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface SwitchControlRenderProps
	extends SwitchControlCommonProps,
		FormControlDataSet,
		SwitchDataSet {}

export type SwitchControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SwitchControlOptions & Partial<SwitchControlCommonProps<ElementOf<T>>>;

/**
 * The element that visually represents a switch.
 */
export function SwitchControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SwitchControlProps<T>>,
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
