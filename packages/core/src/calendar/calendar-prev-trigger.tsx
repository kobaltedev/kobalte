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
import { isPreviousVisibleRangeInvalid } from "./utils";

export interface CalendarPrevTriggerOptions extends Button.ButtonRootOptions {}

export interface CalendarPrevTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> extends Button.ButtonRootCommonProps<T> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocus: JSX.FocusEventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.FocusEventHandlerUnion<T, FocusEvent>;
}

export interface CalendarPrevTriggerRenderProps
	extends CalendarPrevTriggerCommonProps,
		Button.ButtonRootRenderProps {}

export type CalendarPrevTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarPrevTriggerOptions &
	Partial<CalendarPrevTriggerCommonProps<ElementOf<T>>>;

export function CalendarPrevTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, CalendarPrevTriggerProps<T>>,
) {
	const context = useCalendarContext();

	const others = omit(props as CalendarPrevTriggerProps, "disabled", "onClick", "onFocus", "onBlur");

	let prevTriggerFocused = false;

	const prevTriggerDisabled = createMemo(() => {
		return (
			(props as CalendarPrevTriggerProps).disabled ||
			context.isDisabled() ||
			isPreviousVisibleRangeInvalid(
				context.startDate(),
				context.min(),
				context.max(),
			)
		);
	});

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
		callHandler(e, (props as CalendarPrevTriggerProps).onClick as JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>);
		context.focusPreviousPage();
	};

	const onFocus: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, (props as CalendarPrevTriggerProps).onFocus as JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent>);
		prevTriggerFocused = true;
	};

	const onBlur: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, (props as CalendarPrevTriggerProps).onBlur as JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent>);
		prevTriggerFocused = false;
	};

	// If the trigger becomes disabled while focused, move focus to the calendar body.
	createEffect(
		() => prevTriggerDisabled(),
		(disabled) => {
			if (disabled && prevTriggerFocused) {
				prevTriggerFocused = false;
				context.setIsFocused(true);
			}
		},
	);

	return (
		<Button.Root
			disabled={prevTriggerDisabled()}
			aria-label={context.translations().previous}
			onClick={onClick}
			onFocus={onFocus}
			onBlur={onBlur}
			{...others}
		/>
	);
}
