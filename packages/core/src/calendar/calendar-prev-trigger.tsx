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
import { type Component, createEffect, createMemo, omit } from "solid-js";

import * as Button from "../button/index.tsx";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";
import { useCalendarContext } from "./calendar-context.tsx";
import { isPreviousVisibleRangeInvalid } from "./utils.ts";

export interface CalendarPrevTriggerOptions extends Button.ButtonRootOptions {}

export interface CalendarPrevTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
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

	const p = props as CalendarPrevTriggerProps;

	const others = omit(p, "onClick", "onFocus", "onBlur");

	let prevTriggerFocused = false;

	const prevTriggerDisabled = createMemo(() => {
		return (
			props.disabled ||
			context.isDisabled() ||
			isPreviousVisibleRangeInvalid(
				context.startDate(),
				context.min(),
				context.max(),
			)
		);
	});

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, p.onClick);
		context.focusPreviousPage();
	};

	const onFocus: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, p.onFocus);
		prevTriggerFocused = true;
	};

	const onBlur: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, p.onBlur);
		prevTriggerFocused = false;
	};

	// If the prev trigger become disabled while they are focused, move focus to the calendar body.
	createEffect(
		() => prevTriggerDisabled(),
		(isDisabled) => {
			if (isDisabled && prevTriggerFocused) {
				prevTriggerFocused = false;
				context.setIsFocused(true);
			}
		},
	);

	return (
		<Button.Root<
			Component<
				Omit<CalendarPrevTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			disabled={prevTriggerDisabled()}
			aria-label={context.translations().previous}
			{...others}
			onClick={onClick}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	);
}
