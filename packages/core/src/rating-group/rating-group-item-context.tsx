import { type Accessor, createContext, useContext } from "solid-js";

export interface RatingGroupItemDataSet {
	"data-valid": string | undefined;
	"data-invalid": string | undefined;
	"data-required": string | undefined;
	"data-disabled": string | undefined;
	"data-readonly": string | undefined;
	"data-checked": string | undefined;
	"data-highlighted": string | undefined;
	"data-half": string | undefined;
}

export interface RatingGroupItemState {
	half: boolean;
	highlighted: boolean;
}

export interface RatingGroupItemContextValue {
	state: Accessor<RatingGroupItemState>;
	index: Accessor<number | undefined>;
	select: () => void;
	setIsFocused: (isFocused: boolean) => void;
	dataset: Accessor<RatingGroupItemDataSet>;
	itemId: Accessor<string | undefined>;
	generateId: (part: string) => string;
	registerLabel: (id: string) => () => void;
	registerDescription: (id: string) => () => void;
}

export const RatingGroupItemContext =
	createContext<RatingGroupItemContextValue>();

export function useRatingGroupItemContext() {
	const context = useContext(RatingGroupItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useRatingGroupItemContext` must be used within a `RatingGroup.Item` component",
		);
	}

	return context;
}
