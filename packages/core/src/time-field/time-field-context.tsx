import type { FocusManager } from "@kobalte/utils";
import { type Accessor, createContext, useContext } from "solid-js";
import type { TimeFieldIntlTranslations } from "./time-field.intl";
import type { SegmentType, Time, TimeFieldHourCycle } from "./types";

export interface TimeFieldContextValue {
	translations: Accessor<TimeFieldIntlTranslations>;
	value: Accessor<Time | undefined>;
	setValue: (value: Time) => void;
	hourCycle: Accessor<TimeFieldHourCycle | undefined>;
	resolvedGranularity: Accessor<{
		hour: boolean;
		minute: boolean;
		second: boolean;
	}>;
	segments: Accessor<SegmentType[]>;
	shouldForceLeadingZeros: Accessor<boolean>;
	placeholder: Accessor<Time | undefined>;
	formattedValue: Accessor<string | undefined>;
	isDisabled: Accessor<boolean>;
	focusManager: Accessor<FocusManager>;
	ariaDescribedBy: Accessor<string | undefined>;
	inputRef: Accessor<HTMLElement | undefined>;
	setInputRef: (el: HTMLElement) => void;
	valueDescriptionId: Accessor<string | undefined>;
	registerValueDescriptionId: (id: string) => () => void;
	generateId: (part: string) => string;

	fieldAriaLabel: Accessor<string | undefined>;
	fieldAriaLabelledBy: Accessor<string | undefined>;
	fieldAriaDescribedBy: Accessor<string | undefined>;
	setFieldAriaLabel: (s: string | undefined) => void;
	setFieldAriaLabelledBy: (s: string | undefined) => void;
	setFieldAriaDescribedBy: (s: string | undefined) => void;
}

export const TimeFieldContext = createContext<TimeFieldContextValue>();

export function useTimeFieldContext() {
	const context = useContext(TimeFieldContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useTimeFieldContext` must be used within a `TimeField` component",
		);
	}

	return context;
}
