import type { Calendar } from "@internationalized/date";
import type { FocusGroup } from "@solid-primitives/focus";
import { type Accessor, createContext, useContext } from "solid-js";
import type { DateFieldIntlTranslations } from "./date-field.intl.ts";
import type {
	DateFieldOptions,
	DateSegment,
	DateValue,
	SegmentType,
} from "./types.ts";

export interface DateFieldContextValue {
	translations: Accessor<DateFieldIntlTranslations>;
	value: Accessor<DateValue | undefined>;
	setValue: (value: DateValue) => void;
	calendar: Accessor<Calendar>;
	dateValue: Accessor<Date | undefined>;
	dateFormatterResolvedOptions: Accessor<Intl.ResolvedDateTimeFormatOptions>;
	segments: Accessor<DateSegment[]>;
	formattedValue: Accessor<string | undefined>;
	isDisabled: Accessor<boolean>;
	focusManager: Accessor<FocusGroup>;
	ariaDescribedBy: Accessor<string | undefined>;
	inputRef: Accessor<HTMLElement | undefined>;
	setInputRef: (el: HTMLElement) => void;
	valueDescriptionId: Accessor<string | undefined>;
	registerValueDescriptionId: (id: string) => () => void;
	generateId: (part: string) => string;

	increment(type: SegmentType): void;
	decrement(type: SegmentType): void;
	incrementPage(type: SegmentType): void;
	decrementPage(type: SegmentType): void;
	setSegment(type: SegmentType, value: number): void;
	clearSegment(type: SegmentType): void;
	formatValue(fieldOptions: DateFieldOptions): string;

	fieldAriaLabel: Accessor<string | undefined>;
	fieldAriaLabelledBy: Accessor<string | undefined>;
	fieldAriaDescribedBy: Accessor<string | undefined>;
	setFieldAriaLabel: (s: string | undefined) => void;
	setFieldAriaLabelledBy: (s: string | undefined) => void;
	setFieldAriaDescribedBy: (s: string | undefined) => void;
}

export const DateFieldContext = createContext<DateFieldContextValue>();

export function useDateFieldContext() {
	const context = useContext(DateFieldContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useDateFieldContext` must be used within a `DateField` component",
		);
	}

	return context;
}
