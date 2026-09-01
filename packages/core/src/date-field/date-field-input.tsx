import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	createEffect,
	For,
	merge,
	omit,
	type Ref,
} from "solid-js";
import { useFormControlContext } from "../form-control/index.ts";
import { useLocale } from "../i18n/index.tsx";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useDateFieldContext } from "./date-field-context.tsx";
import type { DateSegment } from "./types.ts";

export interface DateFieldInputOptions {
	children?: (segment: Accessor<DateSegment>) => JSX.Element;
}

export interface DateFieldInputCommonProps<
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

export interface DateFieldInputRenderProps extends DateFieldInputCommonProps {
	role: "presentation";
	children: JSX.Element;
}

export type DateFieldInputProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DateFieldInputOptions & Partial<DateFieldInputCommonProps<ElementOf<T>>>;

export function DateFieldInput<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DateFieldInputProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const dateFieldContext = useDateFieldContext();

	const mergedProps = merge(
		{
			id: dateFieldContext.generateId("input"),
		},
		props as DateFieldInputProps,
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
		(label) => {
			dateFieldContext.setFieldAriaLabel(label);
		},
	);

	createEffect(
		() =>
			formControlContext.getAriaLabelledBy(
				others.id,
				others["aria-label"],
				mergedProps["aria-labelledby"],
			),
		(labelledBy) => {
			dateFieldContext.setFieldAriaLabelledBy(labelledBy);
		},
	);

	createEffect(
		() =>
			[mergedProps["aria-describedby"], dateFieldContext.ariaDescribedBy()]
				.filter(Boolean)
				.join(" "),
		(describedBy) => {
			dateFieldContext.setFieldAriaDescribedBy(describedBy);
		},
	);

	const { direction } = useLocale();

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown);

		switch (e.key) {
			case "ArrowLeft":
				e.preventDefault();
				e.stopPropagation();
				if (direction() === "rtl") {
					dateFieldContext.focusManager().focusNext();
				} else {
					dateFieldContext.focusManager().focusPrevious();
				}
				break;
			case "ArrowRight":
				e.preventDefault();
				e.stopPropagation();
				if (direction() === "rtl") {
					dateFieldContext.focusManager().focusPrevious();
				} else {
					dateFieldContext.focusManager().focusNext();
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
		<Polymorphic<DateFieldInputRenderProps>
			as="div"
			role="presentation"
			ref={[dateFieldContext.setInputRef, mergedProps.ref]}
			aria-labelledby={dateFieldContext.fieldAriaLabelledBy()}
			aria-describedby={dateFieldContext.fieldAriaDescribedBy()}
			{...formControlContext.dataset()}
			{...others}
			onKeyDown={onKeyDown}
			onFocusOut={onFocusOut}
		>
			<For each={dateFieldContext.segments()} keyed={false}>
				{(segment) => mergedProps.children?.(segment)}
			</For>
		</Polymorphic>
	);
}
