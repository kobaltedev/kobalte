/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createEffect, createMemo, omit } from "solid-js";

import * as Button from "../button";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { isNextVisibleRangeInvalid } from "./utils";

export interface CalendarNextTriggerOptions extends Button.ButtonRootOptions {}

export interface CalendarNextTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> extends Button.ButtonRootCommonProps<T> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocus: JSX.FocusEventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.FocusEventHandlerUnion<T, FocusEvent>;
}

export interface CalendarNextTriggerRenderProps
	extends CalendarNextTriggerCommonProps,
		Button.ButtonRootRenderProps {}

export type CalendarNextTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarNextTriggerOptions &
	Partial<CalendarNextTriggerCommonProps<ElementOf<T>>>;

export function CalendarNextTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, CalendarNextTriggerProps<T>>,
) {
	const context = useCalendarContext();

	const others = omit(props as CalendarNextTriggerProps, "disabled", "onClick", "onFocus", "onBlur");

	let nextTriggerFocused = false;

	const nextTriggerDisabled = createMemo(() => {
		return (
			(props as CalendarNextTriggerProps).disabled ||
			context.isDisabled() ||
			isNextVisibleRangeInvalid(context.endDate(), context.min(), context.max())
		);
	});

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
		callHandler(e, (props as CalendarNextTriggerProps).onClick as JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>);
		context.focusNextPage();
	};

	const onFocus: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, (props as CalendarNextTriggerProps).onFocus as JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent>);
		nextTriggerFocused = true;
	};

	const onBlur: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, (props as CalendarNextTriggerProps).onBlur as JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent>);
		nextTriggerFocused = false;
	};

	// If the trigger becomes disabled while focused, move focus to the calendar body.
	createEffect(
		() => nextTriggerDisabled(),
		(disabled) => {
			if (disabled && nextTriggerFocused) {
				nextTriggerFocused = false;
				context.setIsFocused(true);
			}
		},
	);

	return (
		<Button.Root
			disabled={nextTriggerDisabled()}
			aria-label={context.translations().next}
			onClick={onClick}
			onFocus={onFocus}
			onBlur={onBlur}
			{...others}
		/>
	);
}
