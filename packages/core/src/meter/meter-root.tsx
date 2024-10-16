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
import type { ProgressRootOptions } from "../progress";
import {
	MeterContext,
	type MeterContextValue,
	type MeterDataSet,
} from "./meter-context";

export interface MeterRootOptions
	extends Omit<ProgressRootOptions, "indeterminate"> {}

export interface MeterRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface MeterRootRenderProps
	extends MeterRootCommonProps,
		MeterDataSet {
	role: "meter";
	"aria-valuenow": number | undefined;
	"aria-valuemin": number;
	"aria-valuemax": number;
	"aria-valuetext": string | undefined;
	"aria-labelledby": string | undefined;
}

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
		},
		props as MeterRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"value",
		"minValue",
		"maxValue",
		"getValueLabel",
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
		return `${Math.round(valuePercent() * 100)}%`;
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
				role="meter"
				aria-valuenow={value()}
				aria-valuemin={local.minValue}
				aria-valuemax={local.maxValue}
				aria-valuetext={valueLabel()}
				aria-labelledby={labelId()}
				{...others}
			/>
		</MeterContext.Provider>
	);
}
