import { access, createGenerateId, type ValidationState } from "@kobalte/utils";
import { createFocusGroup } from "@solid-primitives/focus";
import { createFormResetListener } from "@solid-primitives/form";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	createMemo,
	createSignal,
	createUniqueId,
	merge,
	omit,
	type Ref,
} from "solid-js";
import {
	createFormControl,
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
} from "../form-control/index.ts";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import {
	createControllableSignal,
	createRegisterId,
} from "../primitives/index.ts";
import {
	TIME_FIELD_INTL_MESSAGES,
	type TimeFieldIntlTranslations,
} from "./time-field.intl.ts";
import {
	TimeFieldContext,
	type TimeFieldContextValue,
} from "./time-field-context.tsx";
import { TimeFieldValueDescription } from "./time-field-value-description.tsx";
import type {
	SegmentType,
	Time,
	TimeFieldGranularity,
	TimeFieldHourCycle,
} from "./types.ts";

export interface TimeFieldRootOptions {
	/** The current value (controlled). */
	value?: Time;

	/** The default value (uncontrolled). */
	defaultValue?: Time;

	/** Handler that is called when the value changes. */
	onChange?: (value: Time) => void;

	/**
	 * Whether to display the time in 12 or 24-hour format.
	 * By default, this is determined by the user's locale.
	 */
	hourCycle?: TimeFieldHourCycle;

	/**
	 * Determines the smallest unit that is displayed in the time field.
	 * Defaults to `"minute"`.
	 */
	granularity?: TimeFieldGranularity;

	/**
	 * Whether to always show leading zeros in the hour field.
	 * Defaults to `false`
	 */
	forceLeadingZeros?: boolean;

	/**
	 * A placeholder time shown when no value is selected.
	 */
	placeholder?: Time;

	/** The minimum allowed time that a user may select. */
	min?: Time;

	/** The maximum allowed time that a user may select. */
	max?: Time;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the time field.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the time field should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the time field is required. */
	required?: boolean;

	/** Whether the time field is disabled. */
	disabled?: boolean;

	/** Whether the time field is read only. */
	readOnly?: boolean;

	/** The localized strings of the component. */
	translations?: TimeFieldIntlTranslations;
}

export interface TimeFieldRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: Ref<T>;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
	children: JSX.Element;
}

export interface TimeFieldRootRenderProps
	extends TimeFieldRootCommonProps,
		FormControlDataSet {
	role: "group";
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
}

export type TimeFieldRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TimeFieldRootOptions & Partial<TimeFieldRootCommonProps<ElementOf<T>>>;

export function TimeFieldRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TimeFieldRootProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement>();

	const defaultId = `time-field-${createUniqueId()}`;

	const mergedProps = merge(
		{
			id: defaultId,
			granularity: "minute",
			translations: TIME_FIELD_INTL_MESSAGES,
		},
		props as TimeFieldRootProps,
	);

	const formControlProps = omit(
		mergedProps,
		"ref",
		"translations",
		"min",
		"max",
		"placeholder",
		"hourCycle",
		"granularity",
		"forceLeadingZeros",
		"validationState",
		"value",
		"defaultValue",
		"onChange",
		"aria-labelledby",
		"aria-describedby",
		"children",
	);
	const others = omit(
		mergedProps,
		"ref",
		"translations",
		"min",
		"max",
		"placeholder",
		"hourCycle",
		"granularity",
		"forceLeadingZeros",
		"validationState",
		"value",
		"defaultValue",
		"onChange",
		"aria-labelledby",
		"aria-describedby",
		"children",
		...FORM_CONTROL_PROP_NAMES,
	);

	const [inputRef, setInputRef] = createSignal<HTMLDivElement>();
	const [valueDescriptionId, setValueDescriptionId] = createSignal<string>();

	const [fieldAriaLabel, setFieldAriaLabel] = createSignal<string>();
	const [fieldAriaLabelledBy, setFieldAriaLabelledBy] = createSignal<string>();
	const [fieldAriaDescribedBy, setFieldAriaDescribedBy] =
		createSignal<string>();

	// Segment navigation is driven manually (see `time-field-segment.tsx`), so
	// disable `createFocusGroup`'s automatic arrow-key/Home/End/Tab handling.
	const focusManager = createFocusGroup(inputRef, () => ({
		keyboardNavigation: false,
	}));

	const [value, _setValue] = createControllableSignal<
		Partial<Time> | undefined
	>({
		value: () => mergedProps.value,
		defaultValue: () => mergedProps.defaultValue,
		onChange: (value) => mergedProps.onChange?.(value!),
	});

	const setValue = (v: Partial<Time> | undefined) => {
		if (!v) {
			_setValue(undefined);
			return;
		}

		const newValue = { ...value() };

		if ("hour" in v) newValue.hour = v.hour;
		if ("minute" in v) newValue.minute = v.minute;
		if ("second" in v) newValue.second = v.second;

		_setValue(newValue);
	};

	createFormResetListener(ref, () => {
		setValue(mergedProps.defaultValue);
	});

	const validationState = createMemo(() => {
		if (mergedProps.validationState) {
			return mergedProps.validationState;
		}

		const minTime = Number.parseInt(
			`${(mergedProps.min?.hour ?? "00").toString().padStart(2, "0")}${(mergedProps.min?.minute ?? "00").toString().padStart(2, "0")}${(mergedProps.min?.second ?? "00").toString().padStart(2, "0")}`,
			10,
		);
		const maxTime = Number.parseInt(
			`${(mergedProps.max?.hour ?? "23").toString().padStart(2, "0")}${(mergedProps.max?.minute ?? "59").toString().padStart(2, "0")}${(mergedProps.max?.second ?? "59").toString().padStart(2, "0")}`,
			10,
		);
		const val = Number.parseInt(
			`${(value()?.hour ?? "00").toString().padStart(2, "0")}${(value()?.minute ?? "00").toString().padStart(2, "0")}${(value()?.second ?? "00").toString().padStart(2, "0")}`,
			10,
		);

		if (val > maxTime || val < minTime) return "invalid";

		return undefined;
	});

	const { formControlContext } = createFormControl(
		merge(formControlProps, {
			get validationState() {
				return validationState();
			},
		}),
	);

	const resolvedGranularity = createMemo(() => {
		const granularity = props.granularity ?? "minute";

		if (typeof granularity === "object") return granularity;

		return {
			hour: true,
			minute: granularity === "minute" || granularity === "second",
			second: granularity === "second",
		};
	});

	const formattedValue = createMemo(() => {
		let hour = value()?.hour ?? 0;
		const pm = hour > 12;

		if (mergedProps.hourCycle === 12 && pm) {
			hour -= 12;
		}

		const padding = mergedProps.forceLeadingZeros ? 2 : 1;

		const segments: string[] = [];

		if (resolvedGranularity().hour) {
			segments.push(hour.toString().padStart(padding, "0"));
		}

		if (resolvedGranularity().minute) {
			segments.push((value()?.minute ?? 0).toString().padStart(padding, "0"));
		}

		if (resolvedGranularity().second) {
			segments.push((value()?.second ?? 0).toString().padStart(padding, "0"));
		}

		let val = segments.join(":");

		if (mergedProps.hourCycle === 12) {
			val += ` ${pm ? mergedProps.translations?.pm : mergedProps.translations?.am}`;
		}

		return val;
	});

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			access(mergedProps.id),
			others["aria-label"],
			mergedProps["aria-labelledby"],
		);
	};

	const ariaDescribedBy = () => {
		return (
			[
				valueDescriptionId(),
				formControlContext.getAriaDescribedBy(mergedProps["aria-describedby"]),
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const segments = createMemo(() => {
		const seg: SegmentType[] = (
			Object.keys(resolvedGranularity()) as Array<"hour" | "minute" | "second">
		).filter((k) => resolvedGranularity()[k]);

		if (seg.includes("hour") && mergedProps.hourCycle === 12)
			seg.push("dayPeriod");

		return seg;
	});

	const context: TimeFieldContextValue = {
		translations: () => mergedProps.translations!,
		value,
		setValue,
		hourCycle: () => mergedProps.hourCycle,
		resolvedGranularity,
		forceLeadingZeros: () => mergedProps.forceLeadingZeros ?? false,
		placeholder: () => mergedProps.placeholder,
		formattedValue,
		focusManager: () => focusManager,
		isDisabled: () => formControlContext.isDisabled() ?? false,
		ariaDescribedBy,
		inputRef,
		setInputRef,
		valueDescriptionId,
		registerValueDescriptionId: createRegisterId(setValueDescriptionId),
		generateId: createGenerateId(() => access(mergedProps.id)!),
		segments,
		fieldAriaLabel,
		fieldAriaLabelledBy,
		fieldAriaDescribedBy,
		setFieldAriaLabel,
		setFieldAriaLabelledBy,
		setFieldAriaDescribedBy,
	};

	return (
		<FormControlContext value={formControlContext}>
			<TimeFieldContext value={context}>
				<Polymorphic<TimeFieldRootRenderProps>
					as="div"
					ref={[setRef, mergedProps.ref]}
					role="group"
					id={access(mergedProps.id)!}
					aria-invalid={
						formControlContext.validationState() === "invalid" || undefined
					}
					aria-required={formControlContext.isRequired() || undefined}
					aria-disabled={formControlContext.isDisabled() || undefined}
					aria-readonly={formControlContext.isReadOnly() || undefined}
					aria-labelledby={ariaLabelledBy()}
					aria-describedby={ariaDescribedBy()}
					{...formControlContext.dataset()}
					{...others}
				>
					{mergedProps.children}
					<TimeFieldValueDescription />
				</Polymorphic>
			</TimeFieldContext>
		</FormControlContext>
	);
}
