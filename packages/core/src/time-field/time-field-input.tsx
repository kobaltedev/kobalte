import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	type Accessor,
	Index,
	type JSX,
	type ValidComponent,
	createEffect,
	createMemo,
	splitProps,
} from "solid-js";

import { useFormControlContext } from "../form-control";
import { useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useTimeFieldContext } from "./time-field-context";
import type { SegmentType, Time } from "./types";

export interface TimeFieldInputOptions {
	children?: (segment: Accessor<SegmentType>) => JSX.Element;
}

export interface TimeFieldInputCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
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

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"children",
		"onKeyDown",
		"onFocusOut",
		"aria-labelledby",
		"aria-describedby",
	]);

	createEffect(() => timeFieldContext.setFieldAriaLabel(others["aria-label"]));

	createEffect(() => {
		timeFieldContext.setFieldAriaLabelledBy(
			formControlContext.getAriaLabelledBy(
				others.id,
				others["aria-label"],
				local["aria-labelledby"],
			),
		);
	});

	createEffect(() => {
		timeFieldContext.setFieldAriaDescribedBy(
			[local["aria-describedby"], timeFieldContext.ariaDescribedBy()]
				.filter(Boolean)
				.join(" "),
		);
	});

	const { direction } = useLocale();

	const displayValue = createMemo(() => ({
		hour: 0,
		minute: 0,
		second: 0,
		...timeFieldContext.placeholder(),
		...timeFieldContext.value(),
	}));

	const setValue = (newValue: Time) => {
		if (formControlContext.isDisabled() || formControlContext.isReadOnly()) {
			return;
		}

		timeFieldContext.setValue(newValue);
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

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
		callHandler(e, local.onFocusOut);

		if (formControlContext.isDisabled() || formControlContext.isReadOnly()) {
			return;
		}
	};

	return (
		<Polymorphic<TimeFieldInputRenderProps>
			as="div"
			role="presentation"
			ref={mergeRefs(timeFieldContext.setInputRef, local.ref)}
			aria-labelledby={timeFieldContext.fieldAriaLabelledBy()}
			aria-describedby={timeFieldContext.fieldAriaDescribedBy()}
			onKeyDown={onKeyDown}
			onFocusOut={onFocusOut}
			{...formControlContext.dataset()}
			{...others}
		>
			<Index each={timeFieldContext.segments()}>
				{(segment) => local.children?.(segment)}
			</Index>
		</Polymorphic>
	);
}
