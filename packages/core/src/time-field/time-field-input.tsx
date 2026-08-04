import { callHandler, mergeDefaultProps } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Accessor, createEffect, For, omit, type Ref } from "solid-js";

import { useFormControlContext } from "../form-control/index.ts";
import { useLocale } from "../i18n/index.tsx";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useTimeFieldContext } from "./time-field-context.tsx";
import type { SegmentType } from "./types.ts";

export interface TimeFieldInputOptions {
	children?: (segment: Accessor<SegmentType>) => JSX.Element;
}

export interface TimeFieldInputCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: Ref<T>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
}

export interface TimeFieldInputRenderProps extends TimeFieldInputCommonProps {
	role: "presentation";
	children: JSX.Element;
}

export type TimeFieldInputProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TimeFieldInputOptions & Partial<TimeFieldInputCommonProps<ElementOf<T>>>;

export function TimeFieldInput<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TimeFieldInputProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const timeFieldContext = useTimeFieldContext();

	const mergedProps = mergeDefaultProps(
		{
			id: timeFieldContext.generateId("input"),
		},
		props as TimeFieldInputProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"children",
		"onKeyDown",
		"onFocusOut",
		"aria-labelledby",
		"aria-describedby",
	);

	createEffect(
		() => others["aria-label"],
		(label) => timeFieldContext.setFieldAriaLabel(label),
	);

	createEffect(
		() =>
			formControlContext.getAriaLabelledBy(
				others.id,
				others["aria-label"],
				mergedProps["aria-labelledby"],
			),
		(labelledBy) => timeFieldContext.setFieldAriaLabelledBy(labelledBy),
	);

	createEffect(
		() =>
			[mergedProps["aria-describedby"], timeFieldContext.ariaDescribedBy()]
				.filter(Boolean)
				.join(" "),
		(describedBy) => timeFieldContext.setFieldAriaDescribedBy(describedBy),
	);

	const { direction } = useLocale();

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown);

		switch (e.key) {
			case "ArrowLeft":
				e.preventDefault();
				e.stopPropagation();
				if (direction() === "rtl") {
					timeFieldContext.focusManager().focusNext();
				} else {
					timeFieldContext.focusManager().focusPrevious();
				}
				break;
			case "ArrowRight":
				e.preventDefault();
				e.stopPropagation();
				if (direction() === "rtl") {
					timeFieldContext.focusManager().focusPrevious();
				} else {
					timeFieldContext.focusManager().focusNext();
				}
				break;
		}
	};

	const onFocusOut: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onFocusOut);

		if (formControlContext.isDisabled() || formControlContext.isReadOnly()) {
			return;
		}
	};

	return (
		<Polymorphic<TimeFieldInputRenderProps>
			as="div"
			role="presentation"
			ref={[timeFieldContext.setInputRef, mergedProps.ref]}
			aria-labelledby={timeFieldContext.fieldAriaLabelledBy()}
			aria-describedby={timeFieldContext.fieldAriaDescribedBy()}
			onKeyDown={onKeyDown}
			onFocusOut={onFocusOut}
			{...formControlContext.dataset()}
			{...others}
		>
			<For each={timeFieldContext.segments()} keyed={false}>
				{(segment) => mergedProps.children?.(segment)}
			</For>
		</Polymorphic>
	);
}
