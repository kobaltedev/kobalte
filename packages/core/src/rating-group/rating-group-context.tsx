/*
 * Portions of this file are based on code from chakra-ui/zag
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/tree/main/packages/machines/rating-group
 */

import type { Orientation } from "@kobalte/utils";
import { type Accessor, createContext, useContext } from "solid-js";

export interface RatingGroupContextValue {
	allowHalf: Accessor<boolean | undefined>;
	orientation: Accessor<Orientation>;
	value: Accessor<number | undefined>;
	count: Accessor<number | undefined>;
	isSelectedValue: (value: number) => boolean;
	setSelectedValue: (value: number) => void;
	setIsInteractive: (value: boolean) => void;
	isInteractive: Accessor<boolean>;
	isHoveredValue: (value: number) => boolean;
	hoveredValue: Accessor<number>;
	setHoveredValue: (value: number) => void;
	ariaDescribedBy: Accessor<string | undefined>;
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
