/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/meter/src/useMeter.ts
 */

import { clamp, createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import {
	type Accessor,
	type ValidComponent,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import { createNumberFormatter } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createRegisterId } from "../primitives";
import {
	MeterContext,
	type MeterContextValue,
	type MeterDataSet,
} from "./meter-context";

interface GetValueLabelParams {
	value: number;
	min: number;
	max: number;
}
export interface MeterRootOptions {
	/**
	 * The meter value.
	 * @default 0
	 */
	value?: number;

	/**
	 * The minimum meter value.
	 * @default 0
	 */
	minValue?: number;

	/**
	 * The maximum meter value.
	 * @default 100
	 */
	maxValue?: number;

	/**
	 * A function to get the accessible label text representing the current value in a human-readable format.
	 * If not provided, the value label will be read as a percentage of the max value.
	 */
	getValueLabel?: (params: GetValueLabelParams) => string;
}

export interface MeterRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	role: string;
	"aria-valuenow": number | undefined;
	"aria-valuemin": number;
	"aria-valuemax": number;
	"aria-valuetext": string | undefined;
	"aria-labelledby": string | undefined;
}

export interface MeterRootRenderProps
	extends MeterRootCommonProps,
		MeterDataSet {}

export type MeterRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MeterRootOptions & Partial<MeterRootCommonProps<ElementOf<T>>>;

/**
 * Meter displays numeric value that varies within a defined range.
 */
export function MeterRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MeterRootProps<T>>,
) {
	const defaultId = `meter-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			value: 0,
			minValue: 0,
			maxValue: 100,
			role: "meter",
			indeterminate: false,
		},
		props as MeterRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"value",
		"minValue",
		"maxValue",
		"getValueLabel",
		"role",
		"aria-valuetext",
		"aria-labelledby",
		"aria-valuemax",
		"aria-valuemin",
		"aria-valuenow",
		"indeterminate",
	]);

	const [labelId, setLabelId] = createSignal<string>();

	const defaultFormatter = createNumberFormatter(() => ({ style: "percent" }));

	const value = () => {
		return clamp(local.value!, local.minValue!, local.maxValue!);
	};

	const valuePercent = () => {
		return (value() - local.minValue!) / (local.maxValue! - local.minValue!);
	};

	const valueLabel = () => {
		if (local.indeterminate) {
			return undefined;
		}
		if (local.getValueLabel) {
			return local.getValueLabel({
				value: value(),
				min: local.minValue!,
				max: local.maxValue!,
			});
		}

		return defaultFormatter().format(valuePercent());
	};

	const meterFillWidth = () => {
		return `${valuePercent() * 100}%`;
	};

	const dataset: Accessor<MeterDataSet> = createMemo(() => {
		return {};
	});
	const context: MeterContextValue = {
		dataset,
		value,
		valuePercent,
		valueLabel,
		labelId,
		meterFillWidth,
		generateId: createGenerateId(() => others.id!),
		registerLabelId: createRegisterId(setLabelId),
	};

	return (
		<MeterContext.Provider value={context}>
			<Polymorphic<MeterRootRenderProps>
				as="div"
				role={local.role || "meter"}
				aria-valuenow={local.indeterminate ? undefined : value()}
				aria-valuemin={local.minValue}
				aria-valuemax={local.maxValue}
				aria-valuetext={valueLabel()}
				aria-labelledby={labelId()}
				{...dataset()}
				{...others}
			/>
		</MeterContext.Provider>
	);
}
