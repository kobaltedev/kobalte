import type { Orientation } from "@kobalte/utils";
import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";
import type { CollectionItemWithRef } from "../primitives";

export interface RatingContextValue {
	value: Accessor<number | undefined>;
	setValue: (value: number) => void;
	allowHalf: Accessor<boolean | undefined>;
	orientation: Accessor<Orientation>;
	hoveredValue: Accessor<number>;
	setHoveredValue: Setter<number>;
	isHovering: Accessor<boolean>;
	ariaDescribedBy: Accessor<string | undefined>;
	items: Accessor<CollectionItemWithRef[]>;
	setItems: Setter<CollectionItemWithRef[]>;
}

export const RatingContext = createContext<RatingContextValue>();

export function useRatingContext() {
	const context = useContext(RatingContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useRatingContext` must be used within a `Rating` component",
		);
	}

	return context;
}
