/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-aria/progress/src/useProgressBar.ts
 */

import { clamp, createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import {
	type Accessor,
	type Component,
	type ValidComponent,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import { createNumberFormatter } from "../i18n";
import {
	Meter,
	type MeterRootCommonProps,
	type MeterRootOptions,
	type MeterRootRenderProps,
} from "../meter";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { createRegisterId } from "../primitives";
import {
	ProgressContext,
	type ProgressContextValue,
	type ProgressDataSet,
} from "./progress-context";

export interface ProgressRootOptions
	extends Omit<MeterRootOptions, "indeterminate"> {
	/** Whether the progress is in an indeterminate state. */
	indeterminate?: boolean;
}

export interface ProgressRootCommonProps<T extends HTMLElement = HTMLElement>
	extends MeterRootCommonProps {}

export interface ProgressRootRenderProps
	extends Omit<MeterRootRenderProps, "role">,
		ProgressRootCommonProps,
		ProgressDataSet {
	role: "progressbar";
}
export type ProgressRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ProgressRootOptions & Partial<ProgressRootCommonProps<ElementOf<T>>>;

/**
 * Progress show either determinate or indeterminate progress of an operation over time.
 */
export function ProgressRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ProgressRootProps<T>>,
) {
	const defaultId = `progress-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			value: 0,
			minValue: 0,
			maxValue: 100,
		},
		props as ProgressRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"value",
		"minValue",
		"maxValue",
		"indeterminate",
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

	const progressFillWidth = () => {
		return local.indeterminate ? undefined : `${valuePercent() * 100}%`;
	};

	const dataset: Accessor<ProgressDataSet> = createMemo(() => {
		let dataProgress: ProgressDataSet["data-progress"] = undefined;

		if (!local.indeterminate) {
			dataProgress = valuePercent() === 1 ? "complete" : "loading";
		}

		return {
			"data-progress": dataProgress,
			"data-indeterminate": local.indeterminate ? "" : undefined,
		};
	});

	const context: ProgressContextValue = {
		dataset,
		value,
		valuePercent,
		valueLabel,
		labelId,
		progressFillWidth,
		generateId: createGenerateId(() => others.id!),
		registerLabelId: createRegisterId(setLabelId),
	};

	return (
		<ProgressContext.Provider value={context}>
			<Meter<
				Component<Omit<ProgressRootRenderProps, keyof MeterRootRenderProps>>
			>
				role="progressbar"
				indeterminate={local.indeterminate || false}
				{...dataset()}
				{...mergedProps}
			/>
		</ProgressContext.Provider>
	);
}
