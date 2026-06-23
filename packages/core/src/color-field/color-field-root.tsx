import { mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent } from "@solidjs/web";
import {
	type Component,
	createMemo,
	createSignal,
	createUniqueId,
	omit,
} from "solid-js";
import { parseColor } from "@solid-primitives/utils/colors";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { createControllableSignal } from "../primitives";
import * as TextField from "../text-field";
import {
	ColorFieldContext,
	type ColorFieldContextValue,
} from "./color-field-context";

export interface ColorFieldRootOptions extends TextField.TextFieldRootOptions {}

export interface ColorFieldRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface ColorFieldRootRenderProps
	extends ColorFieldRootCommonProps,
		TextField.TextFieldRootRenderProps {}

export type ColorFieldRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorFieldRootOptions & Partial<ColorFieldRootCommonProps<ElementOf<T>>>;

export function ColorFieldRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorFieldRootProps<T>>,
) {
	const defaultId = `colorfield-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as ColorFieldRootProps,
	);

	const others = omit(mergedProps, "value", "defaultValue", "onChange");

	const defaultValue = createMemo(() => {
		let defaultValue = mergedProps.defaultValue;
		try {
			defaultValue = parseColor(
				defaultValue?.startsWith("#") ? defaultValue : `#${defaultValue}`,
			).toString("hex");
		} catch {
			defaultValue = "";
		}
		return defaultValue;
	});

	const [value, setValue] = createControllableSignal<string>({
		value: () => mergedProps.value,
		defaultValue,
		onChange: (value) => mergedProps.onChange?.(value),
	});

	const [prevValue, setPrevValue] = createSignal(value());

	const onChange = (value: string) => {
		if (isAllowedInput(value)) {
			setValue(value);
		}
	};

	const onBlur: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> = (
		e,
	) => {
		if (!value()!.length) {
			setPrevValue("");
			return;
		}
		let newValue: string;
		try {
			newValue = parseColor(
				value()!.startsWith("#") ? value()! : `#${value()}`,
			).toString("hex");
		} catch {
			if (prevValue()) {
				setValue(prevValue()!);
			} else {
				setValue("");
			}
			return;
		}
		setValue(newValue);
		setPrevValue(newValue);
	};

	const context: ColorFieldContextValue = {
		onBlur,
	};

	return (
		<ColorFieldContext value={context}>
			<TextField.Root<
				Component<
					Omit<
						ColorFieldRootRenderProps,
						keyof TextField.TextFieldRootRenderProps
					>
				>
			>
				value={value()}
				defaultValue={defaultValue()}
				onChange={onChange}
				{...others}
			/>
		</ColorFieldContext>
	);
}

function isAllowedInput(value: string): boolean {
	return value === "" || !!value.match(/^#?[0-9a-f]{0,6}$/i)?.[0];
}
