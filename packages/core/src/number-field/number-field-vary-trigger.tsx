import { callHandler } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";
import * as Button from "../button";
import { useFormControlContext } from "../form-control";
import { PolymorphicProps } from "../polymorphic";

import { useNumberFieldContext } from "./number-field-context";

export interface NumberFieldVaryTriggerOptions {
	numberFieldVaryType: "increment" | "decrement";
}

export interface NumberFieldVaryTriggerCommonProps
	extends Button.ButtonRootCommonProps {
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
}

export interface NumberFieldVaryTriggerRenderProps
	extends NumberFieldVaryTriggerCommonProps,
		Button.ButtonRootRenderProps {
	"aria-controls": string | undefined;
}

export type NumberFieldVaryTriggerProps = NumberFieldVaryTriggerOptions &
	Partial<NumberFieldVaryTriggerCommonProps>;

export function NumberFieldVaryTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, NumberFieldVaryTriggerProps>,
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
