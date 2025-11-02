import type { FocusManager } from "@kobalte/utils";
import { type Accessor, createContext, useContext } from "solid-js";
import type { TimeFieldIntlTranslations } from "./time-field.intl";
import type { TimeFieldGranularity, TimeFieldHourCycle } from "./types";

export interface TimeFieldContextValue {
	translations: Accessor<TimeFieldIntlTranslations>;
	value: Accessor<Date | undefined>;
	setValue: (value: Date | undefined) => void;
	hourCycle: Accessor<TimeFieldHourCycle | undefined>;
	granularity: Accessor<TimeFieldGranularity>;
	hideTimeZone: Accessor<boolean>;
	shouldForceLeadingZeros: Accessor<boolean>;
	placeholderTime: Accessor<Date>;
	placeholderValue: Accessor<Date | undefined>;
	// defaultTimeZone: Accessor<string | undefined>;
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
