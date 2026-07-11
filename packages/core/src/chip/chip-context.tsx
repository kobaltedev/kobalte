import { type Accessor, createContext, useContext } from "solid-js";

import type { ChipIntlTranslations } from "./chip.intl";

export interface ChipContextValue {
	translations: Accessor<ChipIntlTranslations>;
	disabled: Accessor<boolean>;
}

export const ChipContext = createContext<ChipContextValue>();

export function useChipContext() {
	const context = useContext(ChipContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useChipContext` must be used within a `Chip` component",
		);
	}

	return context;
}
