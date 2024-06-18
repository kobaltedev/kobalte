/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-stately/slider/src/useSliderState.ts
 */

import { clamp, mergeDefaultProps, snapValueToStep } from "@kobalte/utils";
import { type Accessor, createMemo, createSignal } from "solid-js";

import { createControllableArraySignal } from "../primitives";
import { getNextSortedValues, hasMinStepsBetweenValues } from "./utils";

export interface SliderState {
	readonly values: Accessor<number[]>;

	getThumbValue(index: number): number;

	setThumbValue(index: number, value: number): void;

	getThumbPercent(index: number): number;

	setThumbPercent(index: number, percent: number): void;

	isThumbDragging(index: number): boolean;

	setThumbDragging(index: number, dragging: boolean): void;

	readonly focusedThumb: Accessor<number | undefined>;

	setFocusedThumb(index: number | undefined): void;

	getValuePercent(value: number): number;

	getThumbValueLabel(index: number): string;

	getFormattedValue(value: number): string;

	getThumbMinValue(index: number): number;

	getThumbMaxValue(index: number): number;

	getPercentValue(percent: number): number;

	isThumbEditable(index: number): boolean;

	setThumbEditable(index: number, editable: boolean): void;

	incrementThumb(index: number, stepSize?: number): void;

	decrementThumb(index: number, stepSize?: number): void;

	readonly step: Accessor<number>;

	readonly pageSize: Accessor<number>;

	readonly orientation: Accessor<"horizontal" | "vertical">;

	readonly isDisabled: Accessor<boolean>;

	setValues: (next: number[] | ((prev: number[]) => number[])) => void;

	resetValues: () => void;
}

interface StateOpts {
	value: Accessor<number[] | undefined>;
	defaultValue: Accessor<number[] | undefined>;
	orientation?: Accessor<"horizontal" | "vertical">;
	isDisabled?: Accessor<boolean>;
	onChangeEnd?: (value: number[]) => void;
	onChange?: (value: number[]) => void;
	minValue?: Accessor<number>;
	maxValue?: Accessor<number>;
	step?: Accessor<number>;
	numberFormatter: Intl.NumberFormat;
	minStepsBetweenThumbs?: Accessor<number>;
}

export function createSliderState(props: StateOpts): SliderState {
	let dirty = false;

	const mergedProps: StateOpts = mergeDefaultProps(
		{
			minValue: () => 0,
			maxValue: () => 100,
			step: () => 1,
			minStepsBetweenThumbs: () => 0,
			orientation: () => "horizontal",
			isDisabled: () => false,
		},
		props,
	);

	const pageSize = createMemo(() => {
		let calcPageSize = (mergedProps.maxValue!() - mergedProps.minValue!()) / 10;
		calcPageSize = snapValueToStep(
			calcPageSize,
			0,
			calcPageSize + mergedProps.step!(),
			mergedProps.step!(),
		);
		return Math.max(calcPageSize, mergedProps.step!());
	});

	const defaultValue = createMemo(() => {
		return mergedProps.defaultValue() ?? [mergedProps.minValue!()];
	});

	const [values, setValues] = createControllableArraySignal<number>({
		value: () => mergedProps.value(),
		defaultValue,
		onChange: (values) => mergedProps.onChange?.(values),
	});

	const [isDragging, setIsDragging] = createSignal(
		new Array(values().length).fill(false),
	);
	const [isEditables, setEditables] = createSignal(
		new Array(values().length).fill(false),
	);
	const [focusedIndex, setFocusedIndex] = createSignal<number | undefined>(
		undefined,
	);

	const resetValues = () => {
		setValues(defaultValue());
	};

	const getValuePercent = (value: number) => {
		return (
			(value - mergedProps.minValue!()) /
			(mergedProps.maxValue!() - mergedProps.minValue!())
		);
	};

	const getThumbMinValue = (index: number) => {
		return index === 0
			? props.minValue!()
			: values()[index - 1] + props.minStepsBetweenThumbs!() * props.step!();
	};

	const getThumbMaxValue = (index: number) => {
		return index === values().length - 1
			? props.maxValue!()
			: values()[index + 1] - props.minStepsBetweenThumbs!() * props.step!();
	};

	const isThumbEditable = (index: number) => {
		return isEditables()[index];
	};

	const setThumbEditable = (index: number) => {
		setEditables((p) => {
			p[index] = true;
			return p;
		});
	};

	const updateValue = (index: number, value: number) => {
		if (mergedProps.isDisabled!() || !isThumbEditable(index)) return;

		const snappedValue = snapValueToStep(
			value,
			getThumbMinValue(index),
			getThumbMaxValue(index),
			mergedProps.step!(),
		);
		const nextValues = getNextSortedValues(values(), snappedValue, index);

		if (
			!hasMinStepsBetweenValues(
				nextValues,
				mergedProps.minStepsBetweenThumbs!() * mergedProps.step!(),
			)
		) {
			return;
		}

		setValues((prev) => [...replaceIndex(prev, index, snappedValue)]);
	};

	const updateDragging = (index: number, dragging: boolean) => {
		if (mergedProps.isDisabled!() || !isThumbEditable(index)) return;

		const wasDragging = isDragging()[index];
		setIsDragging((p) => [...replaceIndex(p, index, dragging)]);

		if (wasDragging && !isDragging().some(Boolean)) {
			mergedProps.onChangeEnd?.(values());
		}
	};

	const getFormattedValue = (value: number) => {
		return mergedProps.numberFormatter.format(value);
	};

	const setThumbPercent = (index: number, percent: number) => {
		updateValue(index, getPercentValue(percent));
	};

	const getRoundedValue = (value: number) => {
		return (
			Math.round((value - mergedProps.minValue!()) / mergedProps.step!()) *
				mergedProps.step!() +
			mergedProps.minValue!()
		);
	};

	const getPercentValue = (percent: number) => {
		const val =
			percent * (mergedProps.maxValue!() - mergedProps.minValue!()) +
			mergedProps.minValue!();
		return clamp(
			getRoundedValue(val),
			mergedProps.minValue!(),
			mergedProps.maxValue!(),
		);
	};

	const snapThumbValue = (index: number, value: number) => {
		const nextValue = values()[index] + value;
		const nextValues = getNextSortedValues(values(), nextValue, index);
		if (
			hasMinStepsBetweenValues(
				nextValues,
				mergedProps.minStepsBetweenThumbs!() * mergedProps.step!(),
			)
		) {
			updateValue(
				index,
				snapValueToStep(
					nextValue,
					mergedProps.minValue!(),
					mergedProps.maxValue!(),
					mergedProps.step!(),
				),
			);
		}
	};

	const incrementThumb = (index: number, stepSize = 1) => {
		dirty = true;
		snapThumbValue(index, Math.max(stepSize, props.step!()));
	};

	const decrementThumb = (index: number, stepSize = 1) => {
		dirty = true;
		snapThumbValue(index, -Math.max(stepSize, props.step!()));
	};

	return {
		values,
		getThumbValue: (index) => values()[index],
		setThumbValue: updateValue,
		setThumbPercent,
		isThumbDragging: (index) => isDragging()[index],
		setThumbDragging: updateDragging,
		focusedThumb: focusedIndex,
		setFocusedThumb: (index: number | undefined) => {
			if (index === undefined && dirty) {
				dirty = false;
				mergedProps.onChangeEnd?.(values());
			}
			setFocusedIndex(index);
		},
		getThumbPercent: (index) => getValuePercent(values()[index]),
		getValuePercent,
		getThumbValueLabel: (index) => getFormattedValue(values()[index]),
		getFormattedValue,
		getThumbMinValue,
		getThumbMaxValue,
		getPercentValue,
		isThumbEditable,
		setThumbEditable,
		incrementThumb,
		decrementThumb,
		step: mergedProps.step!,
		pageSize,
		orientation: mergedProps.orientation!,
		isDisabled: mergedProps.isDisabled!,
		setValues,
		resetValues,
	};
}

function replaceIndex<T>(array: T[], index: number, value: T) {
	if (array[index] === value) {
		return array;
	}

	return [...array.slice(0, index), value, ...array.slice(index + 1)];
}
