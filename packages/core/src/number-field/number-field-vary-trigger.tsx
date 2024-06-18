import { callHandler } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";
import * as Button from "../button";
import { useFormControlContext } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

import { useNumberFieldContext } from "./number-field-context";

export interface NumberFieldVaryTriggerOptions {
	numberFieldVaryType: "increment" | "decrement";
}

export interface NumberFieldVaryTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> extends Button.ButtonRootCommonProps<T> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface NumberFieldVaryTriggerRenderProps
	extends NumberFieldVaryTriggerCommonProps,
		Button.ButtonRootRenderProps {
	"aria-controls": string | undefined;
}

export type NumberFieldVaryTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = NumberFieldVaryTriggerOptions &
	Partial<NumberFieldVaryTriggerCommonProps<ElementOf<T>>>;

export function NumberFieldVaryTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, NumberFieldVaryTriggerProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useNumberFieldContext();

	const [local, others] = splitProps(props as NumberFieldVaryTriggerProps, [
		"numberFieldVaryType",
		"onClick",
	]);

	return (
		<Button.Root<
			Component<
				Omit<
					NumberFieldVaryTriggerRenderProps,
					keyof Button.ButtonRootRenderProps
				>
			>
		>
			tabIndex={-1}
			disabled={
				formControlContext.isDisabled() ||
				context.rawValue() ===
					(local.numberFieldVaryType === "increment"
						? context.maxValue()
						: context.minValue())
			}
			aria-controls={formControlContext.fieldId()}
			onClick={(e) => {
				callHandler(e, local.onClick);

				context.varyValue(
					context.step() * (local.numberFieldVaryType === "increment" ? 1 : -1),
				);

				context.inputRef()?.focus();
			}}
			{...others}
		/>
	);
}
