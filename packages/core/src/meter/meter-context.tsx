import { type Accessor, createContext, useContext } from "solid-js";

export interface MeterDataSet {}

export interface MeterContextValue {
	dataset: Accessor<MeterDataSet>;
	value: Accessor<number>;
	valuePercent: Accessor<number>;
	valueLabel: Accessor<string | undefined>;
	meterFillWidth: Accessor<string | undefined>;
	labelId: Accessor<string | undefined>;
	generateId: (part: string) => string;
	registerLabelId: (id: string) => () => void;
}

export const MeterContext = createContext<MeterContextValue>();

export function useMeterContext() {
	const context = useContext(MeterContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useMeterContext` must be used within a `Meter.Root` component",
		);
	}

	return context;
}
