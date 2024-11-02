import { composeEventHandlers } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import * as TextField from "../text-field";
import { useColorFieldContext } from "./color-field-context";

export interface ColorFieldInputOptions
	extends TextField.TextFieldInputOptions {}

export interface ColorFieldInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	onBlur: JSX.FocusEventHandlerUnion<T, FocusEvent>;
}

export interface ColorFieldInputRenderProps
	extends ColorFieldInputCommonProps,
		TextField.TextFieldInputRenderProps {
	autoComplete: "off";
	autoCorrect: "off";
	spellCheck: "false";
}

export type ColorFieldInputProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorFieldInputOptions & Partial<ColorFieldInputCommonProps<ElementOf<T>>>;

export function ColorFieldInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, ColorFieldInputProps<T>>,
) {
	const context = useColorFieldContext();

	const [local, others] = splitProps(props, ["onBlur"]);

	return (
		<TextField.Input<
			Component<
				Omit<
					ColorFieldInputRenderProps,
					keyof TextField.TextFieldInputRenderProps
				>
			>
		>
			autoComplete="off"
			autoCorrect="off"
			spellCheck="false"
			onBlur={composeEventHandlers([local.onBlur, context.onBlur])}
			{...others}
		/>
	);
}
