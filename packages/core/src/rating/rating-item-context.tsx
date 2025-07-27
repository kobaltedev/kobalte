import { type Accessor, createContext, useContext } from "solid-js";
import type { FormControlDataSet } from "../form-control";

export interface RatingItemDataSet extends FormControlDataSet {
	"data-checked": string | undefined;
	"data-half": string | undefined;
	"data-highlighted": string | undefined;
}

export interface RatingItemState {
	half: Accessor<boolean>;
	highlighted: Accessor<boolean>;
}

export interface RatingItemContextValue {
	state: RatingItemState;
	dataset: Accessor<RatingItemDataSet>;
	itemId: Accessor<string | undefined>;
	generateId: (part: string) => string;
	registerLabel: (id: string) => () => void;
	registerDescription: (id: string) => () => void;
}

export const RatingItemContext =
	createContext<RatingItemContextValue>();

export function useRatingItemContext() {
	const context = useContext(RatingItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useRatingItemContext` must be used within a `Rating.Item` component",
		);
	}

	return context;
}
