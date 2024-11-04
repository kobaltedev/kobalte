import type { Orientation } from "@kobalte/utils";
import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";
import type { CollectionItemWithRef } from "../primitives";

export interface RatingGroupContextValue {
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
