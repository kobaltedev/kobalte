import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";
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

	const others = omit(
		props as NumberFieldVaryTriggerProps,
		"numberFieldVaryType",
		"onClick",
	);

	return (
		<Button.Root<
			Component<
				Omit<
					NumberFieldVaryTriggerRenderProps,
					keyof Button.ButtonRootRenderProps
				>
			>
		>
			tabindex={-1}
			disabled={
				formControlContext.isDisabled() ||
				context.rawValue() ===
					(props.numberFieldVaryType === "increment"
						? context.maxValue()
						: context.minValue())
			}
			aria-controls={formControlContext.fieldId()}
			onClick={(e) => {
				callHandler(e as any, props.onClick);

				context.varyValue(
					context.step() * (props.numberFieldVaryType === "increment" ? 1 : -1),
				);

				context.inputRef()?.focus();
			}}
			{...others}
		/>
	);
}
