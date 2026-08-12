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
	scrollIntoViewport,
} from "@kobalte/utils";
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
} from "solid-js";

import { useFormControlContext } from "../form-control/index.ts";
import { createFilter, useLocale } from "../i18n/index.tsx";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";
import * as SpinButton from "../spin-button/index.tsx";
import { useTimeFieldContext } from "./time-field-context.tsx";
import type { SegmentType, Time } from "./types.ts";

const PAGE_STEP = {
	hour: 2,
	minute: 15,
	second: 15,
};

export interface TimeFieldSegmentOptions {
	segment: SegmentType;
}

export interface TimeFieldSegmentCommonProps<
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

export interface TimeFieldSegmentRenderProps
	extends TimeFieldSegmentCommonProps,
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

export type TimeFieldSegmentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TimeFieldSegmentOptions &
	Partial<TimeFieldSegmentCommonProps<ElementOf<T>>>;

export function TimeFieldSegment<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TimeFieldSegmentProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const formControlContext = useFormControlContext();
	const context = useTimeFieldContext();

	const mergedProps = merge(
		{
			id: `${context.generateId("segment")}-${createUniqueId()}`,
		},
		props as TimeFieldSegmentProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"segment",
		"onKeyDown",
		"onBeforeInput",
		"onInput",
		"onFocus",
		"children",
	);

	const { locale } = useLocale();

	const resolvedChildren = children(() => mergedProps.children);

	let enteredKeys = "";
	let composition: string | null = "";

	// spin buttons cannot be focused with VoiceOver on iOS.
	const touchPropOverrides = createMemo(() => {
		return (
			isIOS()
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

	const firstSegment = createMemo(() => context.segments()[0]);

	// Prepend the label passed from the field to each segment name.
	// This is needed because VoiceOver on iOS does not announce groups.
	const name = createMemo(() => {
		return context.translations()[mergedProps.segment];
	});

	const ariaLabel = createMemo(() => {
		return [name(), context.fieldAriaLabel()].filter(Boolean).join(", ");
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

		return context.fieldAriaDescribedBy();
	});

	const ariaLabelledBy = createMemo(() => {
		return (
			[mergedProps.id, context.fieldAriaLabelledBy()]
				.filter(Boolean)
				.join(" ") || undefined
		);
	});

	const inputMode = createMemo(() => {
		return formControlContext.isDisabled() ||
			mergedProps.segment === "dayPeriod"
			? undefined
			: "numeric";
	});

	// Safari dayPeriod option doesn't work...
	const filter = createFilter({ sensitivity: "base" });

	const numberParser = createMemo(() => {
		return new NumberParser(locale(), {
			maximumFractionDigits: 0,
		});
	});

	const maxValue = () => (mergedProps.segment === "hour" ? 23 : 59);

	const onBackspaceKeyDown = () => {
		if (
			mergedProps.segment !== "dayPeriod" &&
			context.value()?.[mergedProps.segment] === undefined
		) {
			context.focusManager().focusPrevious();
			return;
		}
		if (mergedProps.segment === "dayPeriod") {
			if ((context.value()?.hour ?? 0) >= 12) {
				if (!formControlContext.isReadOnly())
					context.setValue({ hour: context.value()!.hour! - 12 });
			} else context.focusManager().focusPrevious();
			return;
		}

		if (formControlContext.isReadOnly()) return;

		let newValue = (context.value()?.[mergedProps.segment] ?? 0)
			.toString()
			.slice(0, -1);
		const parsed = numberParser().parse(newValue);
		newValue = parsed === 0 ? "" : newValue;

		if (newValue.length === 0 || parsed === 0) {
			context.setValue({ [mergedProps.segment]: undefined });
		} else {
			context.setValue({ [mergedProps.segment]: parsed });
		}
		enteredKeys = newValue;
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown);

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

		switch (mergedProps.segment) {
			case "dayPeriod":
				if (filter.startsWith(context.translations().am, key)) {
					if ((context.value()?.hour ?? 0) >= 12)
						context.setValue({ hour: context.value()!.hour! - 12 });
				} else if (filter.startsWith(context.translations().pm, key)) {
					if ((context.value()?.hour ?? 0) < 12)
						context.setValue({ hour: context.value()!.hour! + 12 });
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
				let allowsZero = true;

				if (mergedProps.segment === "hour" && context.hourCycle() === 12) {
					allowsZero = false;
					if (numberValue >= 12) {
						numberValue = numberParser().parse(key);
					}

					if ((context.value()?.hour ?? 0) >= 12) {
						numberValue += 12;
					}
				}

				if (numberValue > maxValue()) {
					numberValue = numberParser().parse(key);
				}

				if (Number.isNaN(numberValue)) return;

				const shouldSetValue = numberValue !== 0 || allowsZero;

				if (shouldSetValue) {
					context.setValue({ [mergedProps.segment]: numberValue });
				}

				if (
					Number(`${numberValue}0`) > maxValue() ||
					newValue.length >= String(maxValue).length
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
					mergedProps.segment !== "dayPeriod" &&
					context.value()?.[mergedProps.segment] !== undefined &&
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
					if (
						filter.startsWith(context.translations().am, data) ||
						filter.startsWith(context.translations().pm, data)
					) {
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
			scrollIntoViewport(ref()!, {
				containingElement: getScrollParent(ref()!),
			});

			// Collapse selection to start or Chrome won't fire input events.
			const selection = getWindow(ref()!).getSelection();
			selection?.collapse(ref()!);
		}
	};

	const cycleDayPeriod = () => {
		if ((context.value()?.hour ?? 0) >= 12)
			context.setValue({ hour: context.value()!.hour! - 12 });
		else context.setValue({ hour: context.value()!.hour! + 12 });
	};

	const adjust = (delta: number) => {
		const hour = context.value()?.hour ?? context.placeholder()?.hour ?? 0;

		if (mergedProps.segment === "hour" && context.hourCycle() === 12) {
			const isPM = hour >= 12;
			const h12 = hour % 12;

			const next = (h12 + delta + 12) % 12;

			return next + (isPM ? 12 : 0);
		}

		const max = maxValue();

		return (
			((context.value()?.[mergedProps.segment as keyof Time] ??
				context.placeholder()?.[mergedProps.segment as keyof Time] ??
				0) +
				delta +
				(max + 1)) %
			(max + 1)
		);
	};

	const onIncrement = () => {
		enteredKeys = "";
		if (mergedProps.segment === "dayPeriod") {
			cycleDayPeriod();
			return;
		}
		context.setValue({
			[mergedProps.segment]: adjust(1),
		});
	};

	const onDecrement = () => {
		enteredKeys = "";
		if (mergedProps.segment === "dayPeriod") {
			cycleDayPeriod();
			return;
		}
		context.setValue({
			[mergedProps.segment]: adjust(-1),
		});
	};

	const onIncrementPage = () => {
		enteredKeys = "";
		if (mergedProps.segment === "dayPeriod") {
			cycleDayPeriod();
			return;
		}
		context.setValue({
			[mergedProps.segment]: adjust(PAGE_STEP[mergedProps.segment]),
		});
	};

	const onDecrementPage = () => {
		enteredKeys = "";
		if (mergedProps.segment === "dayPeriod") {
			cycleDayPeriod();
			return;
		}
		context.setValue({
			[mergedProps.segment]: adjust(-PAGE_STEP[mergedProps.segment]),
		});
	};

	const onDecrementToMin = () => {
		enteredKeys = "";
		if (mergedProps.segment === "dayPeriod") {
			cycleDayPeriod();
			return;
		}
		if (mergedProps.segment === "hour" && context.hourCycle() === 12) {
			if ((context.value()?.hour ?? 0) >= 12) context.setValue({ hour: 12 });
			else context.setValue({ hour: 0 });
		} else context.setValue({ [mergedProps.segment]: 0 });
	};

	const onIncrementToMax = () => {
		enteredKeys = "";
		if (mergedProps.segment === "dayPeriod") {
			cycleDayPeriod();
			return;
		}
		if (mergedProps.segment === "hour" && context.hourCycle() === 12) {
			if ((context.value()?.hour ?? 0) >= 12) context.setValue({ hour: 24 });
			else context.setValue({ hour: 12 });
		} else context.setValue({ [mergedProps.segment]: maxValue() });
	};

	createEffect(
		() => context.focusManager(),
		(focusManager) => {
			const element = ref();
			return () => {
				if (getActiveElement(element) === element) {
					const prev = focusManager.focusPrevious();
					if (!prev) {
						focusManager.focusNext();
					}
				}
			};
		},
	);

	const getValue = () => {
		if (mergedProps.segment === "dayPeriod")
			return context.translations()[
				(context.value()?.hour ?? context.placeholder()?.hour ?? 0) >= 12
					? "pm"
					: "am"
			];

		if (mergedProps.segment === "hour") {
			const val = context.value()?.hour ?? context.placeholder()?.hour;
			if (val === undefined) return undefined;
			if (context.hourCycle() === 12) {
				if (val > 12) return val - 12;
				if (val === 0) return 12;
			}
			return val;
		}
		return (
			context.value()?.[mergedProps.segment] ??
			context.placeholder()?.[mergedProps.segment]
		);
	};

	const padding = () =>
		mergedProps.segment !== "hour" ? 2 : context.forceLeadingZeros() ? 2 : 1;
	const textValue = () =>
		(getValue()?.toString() ?? "-".padStart(padding(), "-")).padStart(
			padding(),
			"0",
		);

	return (
		<>
			<SpinButton.Root
				ref={[setRef, mergedProps.ref]}
				tabindex={formControlContext.isDisabled() ? undefined : 0}
				value={getValue()}
				textValue={textValue()}
				minValue={0}
				maxValue={maxValue()}
				validationState={formControlContext.validationState()}
				required={formControlContext.isRequired()}
				disabled={formControlContext.isDisabled()}
				readOnly={formControlContext.isReadOnly()}
				contentEditable={!formControlContext.isReadOnly()}
				inputMode={inputMode()}
				autocorrect={!formControlContext.isReadOnly() ? "off" : undefined}
				autoCapitalize={!formControlContext.isReadOnly() ? "off" : undefined}
				spellcheck={!formControlContext.isReadOnly() ? false : undefined}
				enterkeyhint={!formControlContext.isReadOnly() ? "next" : undefined}
				style={{ "caret-color": "transparent" }}
				aria-label={ariaLabel()}
				aria-labelledby={ariaLabelledBy()}
				aria-describedby={ariaDescribedBy()}
				data-placeholder={
					context.value()?.[
						mergedProps.segment === "dayPeriod" ? "hour" : mergedProps.segment
					] === undefined
						? ""
						: undefined
				}
				data-type={mergedProps.segment}
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
				<Show
					when={resolvedChildren()}
					fallback={textValue().replaceAll("-", "–")}
				>
					{resolvedChildren()}
				</Show>
			</SpinButton.Root>

			<Show
				when={
					(mergedProps.segment === "hour" &&
						(context.resolvedGranularity().minute ||
							context.resolvedGranularity().second)) ||
					(mergedProps.segment === "minute" &&
						context.resolvedGranularity().second)
				}
			>
				<span>:</span>
			</Show>
		</>
	);
}
