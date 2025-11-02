import type { FocusManager } from "@kobalte/utils";
import { type Accessor, createContext, useContext } from "solid-js";
import type { TimeFieldIntlTranslations } from "./time-field.intl";
import type { SegmentType, Time, TimeFieldGranularity, TimeFieldHourCycle } from "./types";

export interface TimeFieldContextValue {
	translations: Accessor<TimeFieldIntlTranslations>;
	value: Accessor<Partial<Time> | undefined>;
	setValue: (value: Partial<Time>) => void;
	hourCycle: Accessor<TimeFieldHourCycle | undefined>;
	resolvedGranularity: Accessor<{
		hour: boolean,
		minute: boolean,
		second: boolean,
}>;
	segments: Accessor<SegmentType[]>,
	shouldForceLeadingZeros: Accessor<boolean>;
	placeholder: Accessor<Partial<Time> | undefined>;
	formattedValue: Accessor<string | undefined>;
	isDisabled: Accessor<boolean>;
	focusManager: Accessor<FocusManager>;
	ariaDescribedBy: Accessor<string | undefined>;
	inputRef: Accessor<HTMLElement | undefined>;
	setInputRef: (el: HTMLElement) => void;
	valueDescriptionId: Accessor<string | undefined>;
	registerValueDescriptionId: (id: string) => () => void;
	generateId: (part: string) => string;
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
