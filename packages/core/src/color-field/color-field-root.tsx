import { mergeDefaultProps } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	batch,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";
import { parseColor } from "../colors";
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

	const [local, others] = splitProps(mergedProps, [
		"value",
		"defaultValue",
		"onChange",
	]);

	const defaultValue = createMemo(() => {
		let defaultValue = local.defaultValue;
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
		value: () => local.value,
		defaultValue,
		onChange: (value) => local.onChange?.(value),
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
		batch(() => {
			setValue(newValue);
			setPrevValue(newValue);
		});
	};

	const context: ColorFieldContextValue = {
		onBlur,
	};

	return (
		<ColorFieldContext.Provider value={context}>
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
		</ColorFieldContext.Provider>
	);
}

function isAllowedInput(value: string): boolean {
	return value === "" || !!value.match(/^#?[0-9a-f]{0,6}$/i)?.[0];
}
