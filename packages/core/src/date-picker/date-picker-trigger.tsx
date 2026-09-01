import type { ValidComponent } from "@solidjs/web";
import { merge, omit } from "solid-js";

import type * as Button from "../button/index.tsx";
import { useFormControlContext } from "../form-control/index.ts";
import type { PolymorphicProps } from "../polymorphic/index.tsx";
import { Popover } from "../popover/index.tsx";
import { useDatePickerContext } from "./date-picker-context.tsx";

export interface DatePickerTriggerOptions {}

export type DatePickerTriggerProps = DatePickerTriggerOptions &
	Button.ButtonRootOptions & {
		disabled?: boolean;
		"aria-label"?: string;
		"aria-labelledby"?: string;
		"aria-describedby"?: string;
	};

/**
 * The button that opens the date picker's calendar popover.
 */
export function DatePickerTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, DatePickerTriggerProps>,
) {
	const formControlContext = useFormControlContext();
	const context = useDatePickerContext();

	const mergedProps = merge(
		{
			id: context.generateId("trigger"),
		},
		props as DatePickerTriggerProps,
	);

	const others = omit(
		mergedProps,
		"disabled",
		"aria-labelledby",
		"aria-describedby",
	);

	const isDisabled = () => {
		return (
			mergedProps.disabled ||
			context.isDisabled() ||
			formControlContext.isDisabled() ||
			formControlContext.isReadOnly()
		);
	};

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			others.id,
			others["aria-label"],
			mergedProps["aria-labelledby"],
		);
	};

	const ariaDescribedBy = () => {
		return (
			[mergedProps["aria-describedby"], context.ariaDescribedBy()]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	return (
		<Popover.Trigger<T>
			{...formControlContext.dataset()}
			{...(others as any)}
			disabled={isDisabled()}
			aria-labelledby={ariaLabelledBy()}
			aria-describedby={ariaDescribedBy()}
		/>
	);
}
