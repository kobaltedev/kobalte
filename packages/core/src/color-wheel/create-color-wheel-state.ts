import { mergeDefaultProps } from "@kobalte/utils";
import { type Accessor, createMemo, createSignal } from "solid-js";
import type { Color } from "../colors";
import { parseColor } from "../colors";
import { createControllableSignal } from "../primitives";
import {
	angleToCartesian,
	cartesianToAngle,
	mod,
	roundDown,
	roundToStep,
} from "./utils";

export interface ColorWheelState {
	readonly value: Accessor<Color>;
	setValue: (value: Color) => void;
	readonly hue: Accessor<number>;
	setHue: (value: number) => void;
	step: Accessor<number>;
	pageSize: Accessor<number>;
	maxValue: Accessor<number>;
	minValue: Accessor<number>;
	increment: (stepSize: number) => void;
	decrement: (stepSize: number) => void;
	getThumbPosition: () => { x: number; y: number };
	setThumbValue: (x: number, y: number, radius: number) => void;
	readonly isDragging: Accessor<boolean>;
	setIsDragging: (value: boolean) => void;
	resetValue: () => void;
	readonly isDisabled: Accessor<boolean>;
}

interface StateOpts {
	value: Accessor<Color | undefined>;
	defaultValue: Accessor<Color | undefined>;
	thumbRadius?: Accessor<number>;
	onChange?: (value: Color) => void;
	onChangeEnd?: (value: Color) => void;
	isDisabled?: Accessor<boolean>;
}

export function createColorWheelState(props: StateOpts): ColorWheelState {
	const mergedProps: StateOpts = mergeDefaultProps(
		{
			isDisabled: () => false,
		},
		props,
	);

	const defaultValue = createMemo(() => {
		return mergedProps.defaultValue() ?? parseColor("hsl(0, 100%, 50%)");
	});

	const [value, setValue] = createControllableSignal<Color>({
		value: mergedProps.value,
		defaultValue,
		onChange: (value) => mergedProps.onChange?.(value),
	});

	const color = createMemo(() => {
		const colorSpace = value()!.getColorSpace();
		return colorSpace === "hsl" || colorSpace === "hsb"
			? value()!
			: value()!.toFormat("hsl");
	});

	const channelRange = () => color().getChannelRange("hue");

	const step = () => channelRange().step;
	const pageSize = () => channelRange().pageSize;
	const maxValue = () => channelRange().maxValue;
	const minValue = () => channelRange().minValue;

	const [isDragging, setIsDragging] = createSignal(false);

	const resetValue = () => {
		setValue(defaultValue());
	};

	const hue = () => color().getChannelValue("hue");

	const setHue = (value: number) => {
		let newValue = value > 360 ? 0 : value;
		newValue = roundToStep(mod(newValue, 360), step());
		if (hue() !== newValue) {
			setValue(color().withChannelValue("hue", newValue));
		}
	};

	const increment = (stepSize = 1) => {
		const newStepSize = Math.max(stepSize, step());
		let newValue = hue() + newStepSize;
		if (newValue >= maxValue()) {
			newValue = minValue();
		}
		setHue(roundToStep(mod(newValue, 360), newStepSize));
	};

	const decrement = (stepSize = 1) => {
		const newStepSize = Math.max(stepSize, step());
		if (hue() === 0) {
			setHue(roundDown(360 / newStepSize) * newStepSize);
		} else {
			setHue(roundToStep(mod(hue() - newStepSize, 360), newStepSize));
		}
	};

	const getThumbPosition = () =>
		angleToCartesian(hue(), mergedProps.thumbRadius!());

	const setThumbValue = (x: number, y: number, radius: number) => {
		if (mergedProps.isDisabled!()) return;
		setHue(cartesianToAngle(x, y, radius));
	};

	const updateDragging = (dragging: boolean) => {
		if (mergedProps.isDisabled!()) return;
		const wasDragging = isDragging();
		setIsDragging(dragging);

		if (wasDragging && !isDragging()) {
			mergedProps.onChangeEnd?.(color());
		}
	};

	return {
		value: color,
		setValue,
		hue,
		setHue,
		step,
		pageSize,
		maxValue,
		minValue,
		increment,
		decrement,
		getThumbPosition,
		setThumbValue,
		isDragging,
		setIsDragging: updateDragging,
		resetValue,
		isDisabled: mergedProps.isDisabled!,
	};
}
