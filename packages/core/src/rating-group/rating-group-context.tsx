import type { Orientation } from "@kobalte/utils";
import { type Accessor, createContext, useContext } from "solid-js";

export interface RatingGroupContextValue {
	ariaDescribedBy: Accessor<string | undefined>;
	isSelectedValue: (value: number) => boolean;
	setSelectedValue: (value: number) => void;
	isHighlightedValue: (value: number) => boolean;
	setHighlightedValue: (value: number) => void;
	allowHalf: boolean;
	count: number;
	setIsInteractive: (value: boolean) => void;
	isInteractive: Accessor<boolean>;
	orientation: Orientation;

	value: Accessor<number>;
	isDisabled: Accessor<boolean>;
	inputId: Accessor<string | undefined>;
	inputRef: Accessor<HTMLInputElement | undefined>;
	generateId: (part: string) => string;
	registerInput: (id: string) => () => void;
	setInputRef: (el: HTMLInputElement) => void;
	labelId: Accessor<string | undefined>;
	registerLabel: (id: string) => () => void;
}

export const RatingGroupContext = createContext<RatingGroupContextValue>();

export function useRatingGroupContext() {
	const context = useContext(RatingGroupContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useRatingGroupContext` must be used within a `RatingGroup` component",
		);
	}

	return context;
}
