import { createContext, useContext } from "solid-js";

export interface StatisticContextValue {
	generateId: (part: string) => string;
	registerLabelId: (id: string) => () => void;
	registerDescriptionId: (id: string) => () => void;
}

export const StatisticContext = createContext<StatisticContextValue>();

export function useStatisticContext() {
	const context = useContext(StatisticContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useStatisticContext` must be used within a `Statistic` component",
		);
	}

	return context;
}
