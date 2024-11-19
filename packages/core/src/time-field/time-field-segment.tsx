/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a98da553e73ca70bb3215a106878fa98fac826f2/packages/%40react-aria/datepicker/src/useDateSegment.ts
 */

import { NumberParser } from "@internationalized/number";
import {
	callHandler,
	getActiveElement,
	getScrollParent,
	getWindow,
	isIOS,
	isMac,
	mergeDefaultProps,
	mergeRefs,
	scrollIntoViewport,
} from "@kobalte/utils";
import {
	type Component,
	type ComponentProps,
	type JSX,
	Show,
	type ValidComponent,
	children,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	on,
	onCleanup,
	splitProps,
} from "solid-js";

import { useFormControlContext } from "../form-control";
import { createDateFormatter, createFilter, useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import * as SpinButton from "../spin-button";
import { useTimeFieldContext } from "./time-field-context";
import { useTimeFieldFieldContext } from "./time-field-field-context";
import type { TimeSegment } from "./types";

export interface TimeFieldSegmentOptions {
	segment: TimeSegment;
}

export interface TimeFieldSegmentCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onBeforeInput: JSX.EventHandlerUnion<T, InputEvent>;
	onInput: JSX.EventHandlerUnion<T, InputEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	children: JSX.Element;
}

export interface TimeFieldSegmentRenderProps
	extends TimeFieldSegmentCommonProps,
		SpinButton.SpinButtonRootRenderProps {}

export type TimeFieldSegmentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TimeFieldSegmentOptions &
	Partial<TimeFieldSegmentCommonProps<ElementOf<T>>>;

export function TimeFieldSegment<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TimeFieldSegmentProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const formControlContext = useFormControlContext();
	const context = useTimeFieldContext();
	const fieldContext = useTimeFieldFieldContext();

	const mergedProps = mergeDefaultProps(
		{
			id: `${fieldContext.generateId("segment")}-${createUniqueId()}`,
		},
		props as TimeFieldSegmentProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"segment",
		"onKeyDown",
		"onBeforeInput",
		"onInput",
		"onFocus",
		"children",
	]);

	const { locale } = useLocale();

	const [textValue, setTextValue] = createSignal(
		local.segment.isPlaceholder ? "" : local.segment.text,
	);

	const resolvedChildren = children(() => local.children);

	let enteredKeys = "";
	let composition: string | null = "";

	// spin buttons cannot be focused with VoiceOver on iOS.
	const touchPropOverrides = createMemo(() => {
		return (
			isIOS() || local.segment.type === "timeZoneName"
				? {
						role: "textbox",
						"aria-valuemax": undefined,
						"aria-valuemin": undefined,
						"aria-valuetext": undefined,
						"aria-valuenow": undefined,
					}
				: {}
		) as ComponentProps<"div">;
	});

	const firstSegment = createMemo(() =>
		fieldContext.segments().find((s) => s.isEditable),
	);

	// Prepend the label passed from the field to each segment name.
	// This is needed because VoiceOver on iOS does not announce groups.
	const name = createMemo(() => {
		return local.segment.type === "literal"
			? ""
			: context.translations()[local.segment.type];
	});

	const ariaLabel = createMemo(() => {
		return `${name()}${
			fieldContext.ariaLabel() ? `, ${fieldContext.ariaLabel()}` : ""
		}${fieldContext.ariaLabelledBy() ? ", " : ""}`;
	});

	const ariaDescribedBy = createMemo(() => {
		// Only apply aria-describedby to the first segment, unless the field is invalid. This avoids it being
		// read every time the user navigates to a new segment.
		if (
			local.segment !== firstSegment() &&
			formControlContext.validationState() !== "invalid"
		) {
			return undefined;
		}

		return fieldContext.ariaDescribedBy();
	});

	const ariaLabelledBy = createMemo(() => {
		return (
			[mergedProps.id, fieldContext.ariaLabelledBy()]
				.filter(Boolean)
				.join(" ") || undefined
		);
	});

	const isEditable = createMemo(() => {
		return (
			!formControlContext.isDisabled() &&
			!formControlContext.isReadOnly() &&
			local.segment.isEditable
		);
	});

	const inputMode = createMemo(() => {
		return formControlContext.isDisabled() ||
			local.segment.type === "dayPeriod" ||
			!isEditable()
			? undefined
			: "numeric";
	});

	// Safari dayPeriod option doesn't work...
	const filter = createFilter({ sensitivity: "base" });

	const options = createMemo(() => fieldContext.dateFormatterResolvedOptions());

	const hourDateFormatter = createDateFormatter(() => ({
		hour: "numeric",
		hour12: options().hour12,
		timeZone: options().timeZone,
	}));

	const amPmFormatter = createDateFormatter({
		hour: "numeric",
		hour12: true,
	});

	const am = createMemo(() => {
		const date = new Date();
		date.setHours(0);

		return (
			amPmFormatter()
				.formatToParts(date)
				.find((part) => part.type === "dayPeriod")?.value ?? ""
		);
	});

	const pm = createMemo(() => {
		const date = new Date();
		date.setHours(12);

		return (
			amPmFormatter()
				.formatToParts(date)
				.find((part) => part.type === "dayPeriod")?.value ?? ""
		);
	});

	const numberParser = createMemo(() => {
		return new NumberParser(locale(), {
			maximumFractionDigits: 0,
		});
	});

	const onBackspaceKeyDown = () => {
		if (local.segment.text === local.segment.placeholder) {
			context.focusManager().focusPrevious();
		}
		if (
			numberParser().isValidPartialNumber(local.segment.text) &&
			!formControlContext.isReadOnly() &&
			!local.segment.isPlaceholder
		) {
			let newValue = local.segment.text.slice(0, -1);
			const parsed = numberParser().parse(newValue);
			newValue = parsed === 0 ? "" : newValue;
			if (newValue.length === 0 || parsed === 0) {
				fieldContext.clearSegment(local.segment.type);
			} else {
				fieldContext.setSegment(local.segment.type, parsed);
			}
			enteredKeys = newValue;
		} else if (local.segment.type === "dayPeriod") {
			fieldContext.clearSegment(local.segment.type);
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		// Firefox does not fire selectstart for Ctrl/Cmd + A
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1742153
		if (e.key === "a" && (isMac() ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
		}

		if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
			return;
		}

		switch (e.key) {
			case "Backspace":
			case "Delete": {
				// Safari on iOS does not fire beforeinput for the backspace key because the cursor is at the start.
				e.preventDefault();
				e.stopPropagation();
				onBackspaceKeyDown();
				break;
			}
		}
	};

	const onInputBase = (key: string) => {
		if (formControlContext.isDisabled() || formControlContext.isReadOnly()) {
			return;
		}

		const newValue = enteredKeys + key;

		switch (local.segment.type) {
			case "dayPeriod":
				if (filter.startsWith(am(), key)) {
					fieldContext.setSegment("dayPeriod", 0);
				} else if (filter.startsWith(pm(), key)) {
					fieldContext.setSegment("dayPeriod", 12);
				} else {
					break;
				}
				context.focusManager().focusNext();
				break;
			case "hour":
			case "minute":
			case "second": {
				if (!numberParser().isValidPartialNumber(newValue)) {
					return;
				}

				let numberValue = numberParser().parse(newValue);
				let segmentValue = numberValue;
				let allowsZero = local.segment.minValue === 0;
				if (
					local.segment.type === "hour" &&
					fieldContext.dateFormatterResolvedOptions().hour12
				) {
					switch (fieldContext.dateFormatterResolvedOptions().hourCycle) {
						case "h11":
							if (numberValue > 11) {
								segmentValue = numberParser().parse(key);
							}
							break;
						case "h12":
							allowsZero = false;
							if (numberValue > 12) {
								segmentValue = numberParser().parse(key);
							}
							break;
					}

					if (
						local.segment.value != null &&
						local.segment.value >= 12 &&
						numberValue > 1
					) {
						numberValue += 12;
					}
				} else if (
					local.segment.maxValue != null &&
					numberValue > local.segment.maxValue
				) {
					segmentValue = numberParser().parse(key);
				}

				if (Number.isNaN(numberValue)) {
					return;
				}

				const shouldSetValue = segmentValue !== 0 || allowsZero;

				if (shouldSetValue) {
					fieldContext.setSegment(local.segment.type, segmentValue);
				}

				if (
					(local.segment.maxValue != null &&
						Number(`${numberValue}0`) > local.segment.maxValue) ||
					newValue.length >= String(local.segment.maxValue).length
				) {
					enteredKeys = "";
					if (shouldSetValue) {
						context.focusManager().focusNext();
					}
				} else {
					enteredKeys = newValue;
				}
				break;
			}
		}
	};

	const onBeforeInput: JSX.EventHandlerUnion<HTMLElement, InputEvent> = (e) => {
		callHandler(e, local.onBeforeInput);

		e.preventDefault();

		switch (e.inputType) {
			case "deleteContentBackward":
			case "deleteContentForward":
				if (
					numberParser().isValidPartialNumber(local.segment.text) &&
					!formControlContext.isReadOnly()
				) {
					onBackspaceKeyDown();
				}
				break;
			case "insertCompositionText":
				if (ref) {
					// insertCompositionText cannot be canceled.
					// Record the current state of the element, so we can restore it in the `input` event below.
					composition = ref.textContent;

					// Safari gets stuck in a composition state unless we also assign to the value here.
					// biome-ignore lint/correctness/noSelfAssign: comment above
					ref.textContent = ref.textContent;
				}
				break;
			default:
				if (e.data != null) {
					onInputBase(e.data);
				}
				break;
		}
	};

	const onInput: JSX.EventHandlerUnion<HTMLElement, InputEvent> = (e) => {
		callHandler(e, local.onInput);

		const { inputType, data } = e;

		if (ref && data != null) {
			switch (inputType) {
				case "insertCompositionText":
					ref.textContent = composition;

					// Android sometimes fires key presses of letters as composition events. Need to handle am/pm keys here too.
					// Can also happen e.g. with Pinyin keyboard on iOS.
					if (filter.startsWith(am(), data) || filter.startsWith(pm(), data)) {
						onInputBase(data);
					}
					break;
			}
		}
	};

	const onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocus);

		if (ref) {
			enteredKeys = "";
			scrollIntoViewport(ref, {
				containingElement: getScrollParent(ref),
			});

			// Collapse selection to start or Chrome won't fire input events.
			const selection = getWindow(ref).getSelection();
			selection?.collapse(ref);
		}
	};

	const onIncrement = () => {
		enteredKeys = "";
		fieldContext.increment(local.segment.type);
	};

	const onDecrement = () => {
		enteredKeys = "";
		fieldContext.decrement(local.segment.type);
	};

	const onIncrementPage = () => {
		enteredKeys = "";
		fieldContext.incrementPage(local.segment.type);
	};

	const onDecrementPage = () => {
		enteredKeys = "";
		fieldContext.decrementPage(local.segment.type);
	};

	const onDecrementToMin = () => {
		if (local.segment.minValue == null) {
			return;
		}

		enteredKeys = "";
		fieldContext.setSegment(local.segment.type, local.segment.minValue);
	};

	const onIncrementToMax = () => {
		if (local.segment.maxValue == null) {
			return;
		}

		enteredKeys = "";
		fieldContext.setSegment(local.segment.type, local.segment.maxValue);
	};

	createEffect(() => {
		const resolvedDateValue = fieldContext.dateValue();

		if (resolvedDateValue) {
			if (local.segment.type === "hour" && !local.segment.isPlaceholder) {
				setTextValue(hourDateFormatter().format(resolvedDateValue));
			} else {
				setTextValue(local.segment.isPlaceholder ? "" : local.segment.text);
			}
		}
	});

	createEffect(
		on([() => ref, () => context.focusManager()], ([ref, focusManager]) => {
			const element = ref;

			onCleanup(() => {
				if (getActiveElement(element) === element) {
					const prev = focusManager.focusPrevious();

					if (!prev) {
						focusManager.focusNext();
					}
				}
			});
		}),
	);

	return (
		<Show
			when={local.segment.type !== "literal"}
			fallback={
				<Polymorphic
					as="div"
					aria-hidden={true}
					data-separator=""
					data-type="literal"
					{...others}
				>
					{local.segment.text}
				</Polymorphic>
			}
		>
			<SpinButton.Root<
				Component<
					Omit<
						TimeFieldSegmentRenderProps,
						| keyof SpinButton.SpinButtonRootRenderProps
						| "ref"
						| "onBeforeInput"
						| "onInput"
					>
				>
			>
				ref={mergeRefs((el) => (ref = el), local.ref)}
				tabIndex={
					formControlContext.isDisabled() || !local.segment.isEditable
						? undefined
						: 0
				}
				value={local.segment.value}
				textValue={textValue()}
				minValue={local.segment.minValue}
				maxValue={local.segment.maxValue}
				validationState={formControlContext.validationState()}
				required={formControlContext.isRequired()}
				disabled={formControlContext.isDisabled()}
				readOnly={formControlContext.isReadOnly() || !local.segment.isEditable}
				contentEditable={isEditable()}
				inputMode={inputMode()}
				// @ts-ignore
				autocorrect={isEditable() ? "off" : undefined}
				autoCapitalize={isEditable() ? "off" : undefined}
				spellcheck={isEditable() ? false : undefined}
				enterkeyhint={isEditable() ? "next" : undefined}
				style={{ "caret-color": "transparent" }}
				aria-label={ariaLabel()}
				aria-labelledby={ariaLabelledBy()}
				aria-describedby={ariaDescribedBy()}
				data-placeholder={local.segment.isPlaceholder ? "" : undefined}
				data-type={local.segment.type}
				onKeyDown={onKeyDown}
				onBeforeInput={onBeforeInput}
				onInput={onInput}
				onFocus={onFocus}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				onIncrementPage={onIncrementPage}
				onDecrementPage={onDecrementPage}
				onDecrementToMin={onDecrementToMin}
				onIncrementToMax={onIncrementToMax}
				{...formControlContext.dataset()}
				{...others}
				{...touchPropOverrides()}
			>
				<Show when={resolvedChildren()} fallback={local.segment.text}>
					{resolvedChildren()}
				</Show>
			</SpinButton.Root>
		</Show>
	);
}
