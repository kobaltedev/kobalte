import { type Accessor, createContext, useContext } from "solid-js";
import type { FormControlDataSet } from "../form-control";

export interface RatingGroupItemDataSet extends FormControlDataSet {
	"data-checked": string | undefined;
	"data-half": string | undefined;
	"data-highlighted": string | undefined;
}

export interface RatingGroupItemState {
	half: Accessor<boolean>;
	highlighted: Accessor<boolean>;
}

export interface RatingGroupItemContextValue {
	state: RatingGroupItemState;
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
