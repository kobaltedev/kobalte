import { type Accessor, createContext, useContext } from "solid-js";
import type { MeterContextValue, MeterDataSet } from "../meter/meter-context";

export interface ProgressDataSet extends MeterDataSet {
	"data-progress": "loading" | "complete" | undefined;
	"data-indeterminate": string | undefined;
}

export interface ProgressContextValue
	extends Omit<MeterContextValue, "dataset" | "meterFillWidth"> {
	dataset: Accessor<ProgressDataSet>;
	progressFillWidth: Accessor<string | undefined>;
}

export const ProgressContext = createContext<ProgressContextValue>();

export function useProgressContext() {
	const context = useContext(ProgressContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useProgressContext` must be used within a `Progress.Root` component",
		);
	}

	return context;
}
