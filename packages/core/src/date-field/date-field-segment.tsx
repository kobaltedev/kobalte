/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/@react-aria/datepicker/src/useDateSegment.ts
 */

import { NumberParser } from "@internationalized/number";
import { callHandler } from "@kobalte/utils";
import { isIOS, isMac } from "@solid-primitives/platform";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import {
	children,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	merge,
	omit,
	type Ref,
	Show,
	untrack,
} from "solid-js";
import { useFormControlContext } from "../form-control/index.ts";
import {
	createDateFormatter,
	createFilter,
	useLocale,
} from "../i18n/index.tsx";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import * as SpinButton from "../spin-button/index.tsx";
import { useDateFieldContext } from "./date-field-context.tsx";
import type { DateSegment } from "./types.ts";

export interface DateFieldSegmentOptions {
	segment: DateSegment;
}

export interface DateFieldSegmentCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: Ref<T>;
	onBeforeInput: JSX.EventHandlerUnion<T, InputEvent>;
	onInput: JSX.EventHandlerUnion<T, InputEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	children: JSX.Element;
}

export interface DateFieldSegmentRenderProps
	extends DateFieldSegmentCommonProps,
		SpinButton.SpinButtonRootRenderProps {
	tabindex: string | number | false | undefined;
	contentEditable: boolean | undefined;
	inputMode: string | false | undefined;
	autocorrect: string | false | undefined;
	autoCapitalize: string | false | undefined;
	spellcheck: boolean | "" | "false" | "true" | undefined;
	enterkeyhint: string | false | undefined;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"data-placeholder": string | undefined;
	"data-type": string;
}

export type DateFieldSegmentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DateFieldSegmentOptions &
	Partial<DateFieldSegmentCommonProps<ElementOf<T>>>;

// Node seems to convert everything to lowercase...
const TYPE_MAPPING = {
	dayperiod: "dayPeriod",
};

export function DateFieldSegment<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DateFieldSegmentProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const formControlContext = useFormControlContext();
	const context = useDateFieldContext();

	const mergedProps = merge(
		{
			id: `${context.generateId("segment")}-${createUniqueId()}`,
		},
		props as DateFieldSegmentProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"segment",
		"children",
		"onKeyDown",
		"onBeforeInput",
		"onInput",
		"onFocus",
	);

	const resolvedChildren = children(() => mergedProps.children);

	let enteredKeys = "";
	let composition: string | null = "";

	// spin buttons cannot be focused with VoiceOver on iOS.
	const touchPropOverrides = createMemo(() => {
		return (
			isIOS
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
		context.segments().find((s) => s.isEditable),
	);

	// Prepend the label passed from the field to each segment name.
	// This is needed because VoiceOver on iOS does not announce groups.
	const name = createMemo(() => {
		return mergedProps.segment.type === "literal"
			? ""
			: context.translations()[
					mergedProps.segment.type as keyof ReturnType<
						typeof context.translations
					>
				];
	});

	const ariaLabel = createMemo(() => {
		return `${name()}${
			context.fieldAriaLabel() ? `, ${context.fieldAriaLabel()}` : ""
		}`;
	});

	const ariaLabelledBy = createMemo(() => {
		return (
			[mergedProps.id, context.fieldAriaLabelledBy()]
				.filter(Boolean)
				.join(" ") || undefined
		);
	});

	const ariaDescribedBy = createMemo(() => {
		// Only apply aria-describedby to the first segment, unless the field is invalid. This avoids it being
		// read every time the user navigates to a new segment.
		if (
			mergedProps.segment !== firstSegment() &&
			formControlContext.validationState() !== "invalid"
		) {
			return undefined;
		}

		return context.ariaDescribedBy();
	});

	const isEditable = createMemo(() => {
		return (
			!formControlContext.isDisabled() &&
			!formControlContext.isReadOnly() &&
			mergedProps.segment.isEditable
		);
	});

	const inputMode = createMemo(() => {
		return formControlContext.isDisabled() ||
			mergedProps.segment.type === "dayPeriod" ||
			!isEditable()
			? undefined
			: "numeric";
	});

	// Safari dayPeriod option doesn't work...
	const filter = createFilter({ sensitivity: "base" });

	const options = createMemo(() => context.dateFormatterResolvedOptions());

	const { locale } = useLocale();

	const monthDateFormatter = createDateFormatter(() => ({
		month: "long",
		timeZone: options().timeZone,
	}));

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
		return new NumberParser(locale(), { maximumFractionDigits: 0 });
	});

	const onBackspaceKeyDown = () => {
		if (
			numberParser().isValidPartialNumber(mergedProps.segment.text) &&
			!formControlContext.isReadOnly() &&
			!mergedProps.segment.isPlaceholder
		) {
			const newValue = mergedProps.segment.text.slice(0, -1);
			const parsed = numberParser().parse(newValue);
			if (newValue.length === 0 || parsed === 0) {
				context.clearSegment(mergedProps.segment.type);
			} else {
				context.setSegment(mergedProps.segment.type, parsed);
			}
			enteredKeys = newValue;
		} else if (mergedProps.segment.type === "dayPeriod") {
			context.clearSegment(mergedProps.segment.type);
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown);

		// Firefox does not fire selectstart for Ctrl/Cmd + A
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1742153
		if (e.key === "a" && (isMac ? e.metaKey : e.ctrlKey)) {
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

		switch (mergedProps.segment.type) {
			case "dayPeriod":
				if (filter.startsWith(am(), key)) {
					context.setSegment("dayPeriod", 0);
				} else if (filter.startsWith(pm(), key)) {
					context.setSegment("dayPeriod", 12);
				} else {
					break;
				}
				context.focusManager().focusNext();
				break;
			case "day":
			case "hour":
			case "minute":
			case "second":
			case "month":
			case "year": {
				if (!numberParser().isValidPartialNumber(newValue)) {
					return;
				}

				let numberValue = numberParser().parse(newValue);
				let segmentValue = numberValue;
				const allowsZero = mergedProps.segment.minValue === 0;
				if (
					mergedProps.segment.type === "hour" &&
					context.dateFormatterResolvedOptions().hour12
				) {
					switch (context.dateFormatterResolvedOptions().hourCycle) {
						case "h11":
							if (numberValue > 11) {
								segmentValue = numberParser().parse(key);
							}
							break;
						case "h12":
							if (numberValue > 12) {
								segmentValue = numberParser().parse(key);
							}
							break;
					}

					if (
						mergedProps.segment.value != null &&
						mergedProps.segment.value >= 12 &&
						numberValue > 1
					) {
						numberValue += 12;
					}
				} else if (
					mergedProps.segment.maxValue != null &&
					numberValue > mergedProps.segment.maxValue
				) {
					segmentValue = numberParser().parse(key);
				}

				if (Number.isNaN(numberValue)) {
					return;
				}

				const shouldSetValue = segmentValue !== 0 || allowsZero;

				if (shouldSetValue) {
					context.setSegment(mergedProps.segment.type, segmentValue);
				}

				if (
					(mergedProps.segment.maxValue != null &&
						Number(`${numberValue}0`) > mergedProps.segment.maxValue) ||
					newValue.length >= String(mergedProps.segment.maxValue).length
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
		callHandler(e, mergedProps.onBeforeInput);

		e.preventDefault();

		switch (e.inputType) {
			case "deleteContentBackward":
			case "deleteContentForward":
				if (
					numberParser().isValidPartialNumber(mergedProps.segment.text) &&
					!formControlContext.isReadOnly()
				) {
					onBackspaceKeyDown();
				}
				break;
			case "insertCompositionText":
				if (ref()) {
					const el = ref()!;
					// insertCompositionText cannot be canceled.
					// Record the current state of the element, so we can restore it in the `input` event below.
					composition = el.textContent;

					// Safari gets stuck in a composition state unless we also assign to the value here.
					// biome-ignore lint/correctness/noSelfAssign: comment above
					el.textContent = el.textContent;
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
		callHandler(e, mergedProps.onInput);

		const { inputType, data } = e;

		if (ref() && data != null) {
			switch (inputType) {
				case "insertCompositionText":
					ref()!.textContent = composition;

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
		callHandler(e, mergedProps.onFocus);

		if (ref()) {
			enteredKeys = "";
			ref()!.scrollIntoView({ block: "nearest" });

			// Collapse selection to start or Chrome won't fire input events.
			const selection = (
				ref()!.ownerDocument.defaultView ?? window
			).getSelection();
			selection?.collapse(ref()!);
		}
	};

	const onIncrement = () => {
		enteredKeys = "";
		context.increment(mergedProps.segment.type);
	};

	const onDecrement = () => {
		enteredKeys = "";
		context.decrement(mergedProps.segment.type);
	};

	const onIncrementPage = () => {
		enteredKeys = "";
		context.incrementPage(mergedProps.segment.type);
	};

	const onDecrementPage = () => {
		enteredKeys = "";
		context.decrementPage(mergedProps.segment.type);
	};

	const onDecrementToMin = () => {
		if (mergedProps.segment.minValue == null) {
			return;
		}

		enteredKeys = "";
		context.setSegment(mergedProps.segment.type, mergedProps.segment.minValue);
	};

	const onIncrementToMax = () => {
		if (mergedProps.segment.maxValue == null) {
			return;
		}

		enteredKeys = "";
		context.setSegment(mergedProps.segment.type, mergedProps.segment.maxValue);
	};

	const [textValue, setTextValue] = createSignal(
		untrack(() =>
			mergedProps.segment.isPlaceholder ? "" : mergedProps.segment.text,
		),
	);

	createEffect(
		() => {
			const resolvedDateValue = context.dateValue();
			const type = mergedProps.segment.type;
			const isPlaceholder = mergedProps.segment.isPlaceholder;
			const text = mergedProps.segment.text;

			if (resolvedDateValue && type === "month" && !isPlaceholder) {
				return {
					kind: "month",
					value: monthDateFormatter().format(resolvedDateValue),
				} as const;
			}

			if (resolvedDateValue && type === "hour" && !isPlaceholder) {
				return {
					kind: "hour",
					value: hourDateFormatter().format(resolvedDateValue),
				} as const;
			}

			if (resolvedDateValue) {
				return { kind: "none" } as const;
			}

			return { kind: "fallback", value: isPlaceholder ? "" : text } as const;
		},
		(result) => {
			if (result.kind === "month") {
				setTextValue((prev) =>
					result.value !== prev ? `${prev} – ${result.value}` : result.value,
				);
			} else if (result.kind === "hour" || result.kind === "fallback") {
				setTextValue(result.value);
			}
		},
	);

	createEffect(
		() => context.focusManager(),
		(focusManager) => {
			const element = untrack(ref);
			return () => {
				if (element && element.ownerDocument.activeElement === element) {
					const prev = focusManager.focusPrevious();

					if (!prev) {
						focusManager.focusNext();
					}
				}
			};
		},
	);

	return (
		<Show
			when={mergedProps.segment.type !== "literal"}
			fallback={
				<Polymorphic as="div" aria-hidden={true} data-separator="" {...others}>
					{mergedProps.segment.text}
				</Polymorphic>
			}
		>
			<SpinButton.Root
				ref={[setRef, mergedProps.ref]}
				tabindex={formControlContext.isDisabled() ? undefined : 0}
				value={mergedProps.segment.value}
				textValue={textValue()}
				minValue={mergedProps.segment.minValue}
				maxValue={mergedProps.segment.maxValue}
				validationState={formControlContext.validationState()}
				required={formControlContext.isRequired()}
				disabled={formControlContext.isDisabled()}
				readOnly={
					formControlContext.isReadOnly() || !mergedProps.segment.isEditable
				}
				contentEditable={isEditable()}
				inputMode={inputMode()}
				autocorrect={isEditable() ? "off" : undefined}
				autoCapitalize={isEditable() ? "off" : undefined}
				spellcheck={isEditable() ? false : undefined}
				enterkeyhint={isEditable() ? "next" : undefined}
				style={{ "caret-color": "transparent" }}
				aria-label={ariaLabel()}
				aria-labelledby={ariaLabelledBy()}
				aria-describedby={ariaDescribedBy()}
				data-placeholder={mergedProps.segment.isPlaceholder ? "" : undefined}
				data-type={
					TYPE_MAPPING[mergedProps.segment.type as keyof typeof TYPE_MAPPING] ||
					mergedProps.segment.type
				}
				{...formControlContext.dataset()}
				{...others}
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
				{...touchPropOverrides()}
			>
				<Show when={resolvedChildren()} fallback={mergedProps.segment.text}>
					{resolvedChildren()}
				</Show>
			</SpinButton.Root>
		</Show>
	);
}
