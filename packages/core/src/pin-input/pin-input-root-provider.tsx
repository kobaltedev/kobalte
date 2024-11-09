import { mergeDefaultProps } from "@kobalte/utils";
import {
	type Accessor,
	type JSX,
	type Setter,
	createContext,
	createMemo,
	createSignal,
	createUniqueId,
	onMount,
	useContext,
} from "solid-js";
import type {
	InvalidDetails,
	PinInputRootOptions,
	ValueChangeDetails,
	ValueCompleteDetails,
} from "./types";

export type PinInputContextValue = {
	hiddenInputId: string;
	placeholder: string;
	disabled: boolean;
	readOnly: boolean;
	mask: boolean;
	otp: boolean;
	pattern?: string;
	inputMode: "numeric" | "alphabetic" | "alphanumeric";
	focusedIndex: Accessor<number>;
	setFocusedIndex: Setter<number>;
	values: Accessor<string[]>;
	setValues: Setter<string[]>;
	inputElements: Accessor<HTMLInputElement[]>;
	setInputElements: Setter<HTMLInputElement[]>;
	onValueChange?: (details: ValueChangeDetails) => void;
	onValueInvalid?: (details: InvalidDetails) => void;
	onValueComplete?: (details: ValueCompleteDetails) => void;
	valuesAsString: Accessor<string>;
	hiddenInputRef: HTMLInputElement | null;
};

type DefaultProps = Omit<
	PinInputContextValue,
	| "hiddenInputId"
	| "valueLength"
	| "inputElements"
	| "setInputElements"
	| "values"
	| "focusedIndex"
	| "setFocusedIndex"
	| "setValues"
	| "valuesAsString"
	| "onValueComplete"
	| "hiddenInputRef"
>;

type PinInputContextProviderProps = PinInputRootOptions & {
	children: JSX.Element;
};

export const PinInputContext = createContext<PinInputContextValue>();

export const PinInputProvider = (props: PinInputContextProviderProps) => {
	const hiddenInputId = createUniqueId();
	const hiddenInputRef: HTMLInputElement | null = null;
	const [focusedIndex, setFocusedIndex] = createSignal<number>(-1);
	const [values, setValues] = createSignal<string[]>([]);
	const [inputElements, setInputElements] = createSignal<HTMLInputElement[]>(
		[],
	);

	const setupValues = (initialValues: string[]) => {
		if (initialValues.length > 0) {
			const filledValues = [...initialValues];
			while (filledValues.length < inputElements().length) {
				filledValues.push("");
			}
			setValues(filledValues);
			return;
		}
		const emptyValues = Array.from<string>({
			length: inputElements().length,
		}).fill("");
		setValues(emptyValues);
	};

	onMount(() => {
		setupValues(props.defaultValue ?? props.value ?? []);
		if (mergedProps.autoFocus) {
			setFocusedIndex(0);
			if (inputElements().length > 0) {
				inputElements()[0]?.focus({ preventScroll: true });
			}
		}
	});

	const mergedProps = mergeDefaultProps<PinInputRootOptions, DefaultProps>(
		{
			inputMode: "numeric",
			placeholder: "0",
			disabled: false,
			readOnly: false,
			mask: false,
			otp: false,
			pattern: undefined,
		},
		props,
	);

	const valuesAsString = createMemo(() => {
		const stringValue = values().join("");
		mergedProps.onValueChange?.({
			values: values(),
			valueAsString: stringValue,
		});
		return stringValue;
	});

	const value: PinInputContextValue = {
		hiddenInputId,
		disabled: mergedProps.disabled,
		placeholder: mergedProps.placeholder,
		readOnly: mergedProps.readOnly,
		mask: mergedProps.mask,
		otp: mergedProps.otp,
		inputMode: mergedProps.inputMode,
		values,
		setValues,
		inputElements,
		setInputElements,
		focusedIndex,
		setFocusedIndex,
		valuesAsString,
		onValueInvalid: mergedProps.onValueInvalid,
		onValueComplete: mergedProps.onValueComplete,
		hiddenInputRef,
	};

	return (
		<PinInputContext.Provider value={value}>
			{props.children}
		</PinInputContext.Provider>
	);
};

export const usePinInputContext = () => {
	const context = useContext(PinInputContext);

	if (!context) {
		throw new Error(
			"[kobalte]: `usePinInputContext` must be used within a `PinInputContext.Root` component",
		);
	}

	return context;
};
