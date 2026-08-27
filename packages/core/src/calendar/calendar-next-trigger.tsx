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
import { isNextVisibleRangeInvalid } from "./utils.ts";

export interface CalendarNextTriggerOptions extends Button.ButtonRootOptions {}

export interface CalendarNextTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
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

	const p = props as CalendarNextTriggerProps;

	const others = omit(p, "onClick", "onFocus", "onBlur");

	let nextTriggerFocused = false;

	const nextTriggerDisabled = createMemo(() => {
		return (
			props.disabled ||
			context.isDisabled() ||
			isNextVisibleRangeInvalid(context.endDate(), context.min(), context.max())
		);
	});

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, p.onClick);
		context.focusNextPage();
	};

	const onFocus: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, p.onFocus);
		nextTriggerFocused = true;
	};

	const onBlur: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, p.onBlur);
		nextTriggerFocused = false;
	};

	// If the next trigger become disabled while they are focused, move focus to the calendar body.
	createEffect(
		() => nextTriggerDisabled(),
		(isDisabled) => {
			if (isDisabled && nextTriggerFocused) {
				nextTriggerFocused = false;
				context.setIsFocused(true);
			}
		},
	);

	return (
		<Button.Root<
			Component<
				Omit<CalendarNextTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			disabled={nextTriggerDisabled()}
			aria-label={context.translations().next}
			{...others}
			onClick={onClick}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	);
}
