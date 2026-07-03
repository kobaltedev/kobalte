/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/blob/main/packages/otp-field/src/Root.tsx
 */

import {
	access,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
	type ValidationState,
} from "@kobalte/utils";
import { createFormResetListener } from "@solid-primitives/form";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	createEffect,
	createSignal,
	createUniqueId,
	omit,
	onSettled,
} from "solid-js";
import {
	createFormControl,
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createControllableSignal } from "../primitives";
import {
	OTPFieldContext,
	type OTPFieldContextValue,
} from "./otp-field-context";

export interface OTPFieldRootOptions {
	/** The maximum number of characters in the OTP field. */
	maxLength: number;

	/** The controlled value of the OTP field. */
	value?: string;

	/** The default value when initially rendered. */
	defaultValue?: string;

	/** Event handler called when the value changes. */
	onChange?: (value: string) => void;

	/** Event handler called when the OTP field is completely filled. */
	onComplete?: (value: string) => void;

	/**
	 * Whether to shift password manager icons to the right to avoid overlapping the slots.
	 * @defaultValue true
	 */
	shiftPWManagers?: boolean;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components (Label, Description, ErrorMessage).
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/** The name of the OTP field, used when submitting an HTML form. */
	name?: string;

	/** Whether the OTP field should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must fill the OTP field before the owning form can be submitted. */
	required?: boolean;

	/** Whether the OTP field is disabled. */
	disabled?: boolean;

	/** Whether the OTP field is read only. */
	readOnly?: boolean;
}

export interface OTPFieldRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties | string;
}

export interface OTPFieldRootRenderProps
	extends OTPFieldRootCommonProps,
		FormControlDataSet {
	role: "group";
	id: string;
	"data-kb-otp-field-root": "";
}

export type OTPFieldRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = OTPFieldRootOptions & Partial<OTPFieldRootCommonProps<ElementOf<T>>>;

export function OTPFieldRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, OTPFieldRootProps<T>>,
) {
	let ref: HTMLDivElement | undefined;

	const defaultId = `otpfield-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{ id: defaultId, shiftPWManagers: true },
		props as OTPFieldRootProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"style",
		"maxLength",
		"value",
		"defaultValue",
		"onChange",
		"onComplete",
		"shiftPWManagers",
		...FORM_CONTROL_PROP_NAMES,
	);

	// Track controllability on first render only.
	const initialIsControlled = mergedProps.value !== undefined;

	const [value, setValueRaw] = createControllableSignal<string>({
		value: () => (initialIsControlled ? (mergedProps.value ?? "") : undefined),
		defaultValue: () => mergedProps.defaultValue ?? "",
		onChange: (v) => mergedProps.onChange?.(v),
	});

	const setValue = (v: string) => setValueRaw(v);

	const { formControlContext } = createFormControl(mergedProps);

	const [rootHeight, setRootHeight] = createSignal<number | null>(null);
	onSettled(() => {
		if (!ref) return;
		setRootHeight(ref.getBoundingClientRect().height);
		const observer = new ResizeObserver((entries) => {
			setRootHeight(entries[0]?.contentRect.height ?? null);
		});
		observer.observe(ref);
		return () => observer.disconnect();
	});

	createEffect(
		() => value() ?? "",
		(v) => {
			if (v.length === mergedProps.maxLength) {
				mergedProps.onComplete?.(v);
			}
		},
	);

	createFormResetListener(
		() => ref,
		() => setValue(mergedProps.defaultValue ?? ""),
	);

	const [isFocused, setIsFocused] = createSignal(false);
	const [isHovered, setIsHovered] = createSignal(false);
	const [isInserting, setIsInserting] = createSignal(false);
	const [activeSlots, setActiveSlots] = createSignal<number[]>([]);

	const baseStyle: JSX.CSSProperties = {
		position: "relative",
		"user-select": "none",
		"-webkit-user-select": "none",
		"pointer-events": "none",
	};

	const resolvedStyle = (): JSX.CSSProperties => {
		const userStyle = mergedProps.style;
		if (!userStyle || typeof userStyle === "string") return baseStyle;
		return { ...baseStyle, ...userStyle };
	};

	const context: OTPFieldContextValue = {
		value: () => value() ?? "",
		isFocused,
		isHovered,
		isInserting,
		maxLength: () => mergedProps.maxLength,
		activeSlots,
		shiftPWManagers: () => mergedProps.shiftPWManagers ?? true,
		rootHeight,
		generateId: createGenerateId(() => access(mergedProps.id)!),
		setValue,
		setIsFocused,
		setIsHovered,
		setIsInserting,
		setActiveSlots,
	};

	return (
		<FormControlContext value={formControlContext}>
			<OTPFieldContext value={context}>
				<Polymorphic<OTPFieldRootRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el as HTMLDivElement), mergedProps.ref)}
					style={resolvedStyle()}
					role="group"
					id={access(mergedProps.id)}
					data-kb-otp-field-root=""
					{...formControlContext.dataset()}
					{...others}
				/>
			</OTPFieldContext>
		</FormControlContext>
	);
}
