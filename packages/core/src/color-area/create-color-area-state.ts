import { clamp, mergeDefaultProps, snapValueToStep } from "@kobalte/utils";
import { type Accessor, createMemo, createSignal } from "solid-js";
import {
	type Color,
	type ColorChannel,
	type ColorSpace,
	parseColor,
} from "../colors";
import { createControllableSignal } from "../primitives";

export interface ColorAreaState {
	readonly value: Accessor<Color>;
	setValue: (value: Color) => void;
	xValue: Accessor<number>;
	yValue: Accessor<number>;
	setXValue: (value: number) => void;
	setYValue: (value: number) => void;
	xStep: Accessor<number>;
	yStep: Accessor<number>;
	xPageSize: Accessor<number>;
	yPageSize: Accessor<number>;
	xMaxValue: Accessor<number>;
	yMaxValue: Accessor<number>;
	xMinValue: Accessor<number>;
	yMinValue: Accessor<number>;
	incrementX: (stepSize: number) => void;
	incrementY: (stepSize: number) => void;
	decrementX: (stepSize: number) => void;
	decrementY: (stepSize: number) => void;
	getThumbPosition: () => { x: number; y: number };
	readonly isDragging: Accessor<boolean>;
	setIsDragging: (value: boolean) => void;
	channels: Accessor<{
		xChannel: ColorChannel;
		yChannel: ColorChannel;
		zChannel: ColorChannel;
	}>;
	resetValue: () => void;
	getThumbPercent: () => { x: number; y: number };
	setThumbPercent: (value: { x: number; y: number }) => void;
	setThumbValue: (value: { x: number; y: number }) => void;
	readonly isDisabled: Accessor<boolean>;
}

interface StateOpts {
	value: Accessor<Color | undefined>;
	defaultValue: Accessor<Color | undefined>;
	colorSpace?: Accessor<ColorSpace | undefined>;
	xChannel?: Accessor<ColorChannel | undefined>;
	yChannel?: Accessor<ColorChannel | undefined>;
	onChange?: (value: Color) => void;
	onChangeEnd?: (value: Color) => void;
	isDisabled?: Accessor<boolean>;
}

export function createColorAreaState(props: StateOpts): ColorAreaState {
	const mergedProps: StateOpts = mergeDefaultProps(
		{
			isDisabled: () => false,
			defaultValue: () => parseColor("hsl(0, 100%, 50%)"),
		},
		props,
	);

	const [value, setValue] = createControllableSignal<Color>({
		value: mergedProps.value,
		defaultValue: mergedProps.defaultValue,
		onChange: (value) => mergedProps.onChange?.(value),
	});

	const color = createMemo(() => {
		return mergedProps.colorSpace?.()
			? value()!.toFormat(mergedProps.colorSpace()!)
			: value()!;
	});

	const channels = createMemo(() => {
		return color().getColorSpaceAxes({
			xChannel: mergedProps.xChannel?.(),
			yChannel: mergedProps.yChannel?.(),
		});
	});

	const xChannelRange = () => color().getChannelRange(channels().xChannel);
	const yChannelRange = () => color().getChannelRange(channels().yChannel);

	const xStep = () => xChannelRange().step;
	const yStep = () => yChannelRange().step;

	const xPageSize = () => xChannelRange().pageSize;
	const yPageSize = () => yChannelRange().pageSize;

	const xMaxValue = () => xChannelRange().maxValue;
	const xMinValue = () => xChannelRange().minValue;

	const yMaxValue = () => yChannelRange().maxValue;
	const yMinValue = () => yChannelRange().minValue;

	const [isDragging, setIsDragging] = createSignal(false);

	const initialValue = color();
	const resetValue = () => {
		setValue(initialValue);
	};

	const xValue = () => color().getChannelValue(channels()!.xChannel);
	const yValue = () => color().getChannelValue(channels()!.yChannel);

	const setXValue = (value: number) => {
		if (value === xValue()) return;
		setValue(color().withChannelValue(channels().xChannel, value));
	};

	const setYValue = (value: number) => {
		if (value === yValue()) return;
		setValue(color().withChannelValue(channels().yChannel, value));
	};

	const incrementX = (stepSize = 1) => {
		setXValue(
			xValue() + stepSize > xMaxValue()
				? xMaxValue()
				: snapValueToStep(
						xValue() + stepSize,
						xMinValue(),
						xMaxValue(),
						xStep(),
					),
		);
	};

	const incrementY = (stepSize = 1) => {
		setYValue(
			yValue() + stepSize > yMaxValue()
				? yMaxValue()
				: snapValueToStep(
						yValue() + stepSize,
						yMinValue(),
						yMaxValue(),
						yStep(),
					),
		);
	};

	const decrementX = (stepSize = 1) => {
		setXValue(
			snapValueToStep(xValue() - stepSize, xMinValue(), xMaxValue(), xStep()),
		);
	};

	const decrementY = (stepSize = 1) => {
		setYValue(
			snapValueToStep(yValue() - stepSize, yMinValue(), yMaxValue(), yStep()),
		);
	};

	const getThumbPosition = () => {
		const x = (xValue() - xMinValue()) / (xMaxValue() - xMinValue());
		const y =
			(yMaxValue() - (yValue() - yMinValue())) / (yMaxValue() - yMinValue());
		return { x, y };
	};

	const getValuePercent = () => {
		const x = (xValue() - xMinValue()) / xMaxValue() - xMinValue();
		const y = (yValue() - yMinValue()) / yMaxValue() - yMinValue();
		return { x, y };
	};

	const updateValue = (value: { x: number; y: number }) => {
		if (mergedProps.isDisabled!()) return;
		const xSnappedValue = snapValueToStep(
			value.x,
			xMinValue(),
			xMaxValue(),
			xStep(),
		);
		const ySnappedValue = snapValueToStep(
			value.y,
			yMinValue(),
			yMaxValue(),
			yStep(),
		);

		if (xSnappedValue === xValue() && ySnappedValue === yValue()) return;
		setValue(
			color()
				.withChannelValue(channels().xChannel, xSnappedValue)
				.withChannelValue(channels().yChannel, ySnappedValue),
		);
	};

	const setThumbPercent = (value: { x: number; y: number }) => {
		updateValue(getPercentValues(value.x, value.y));
	};

	const getRoundedValues = (value: { x: number; y: number }) => {
		const x =
			Math.round((value.x - xMinValue()) / xStep()) * xStep() + xMinValue();
		const y =
			Math.round((value.y - yMinValue()) / yStep()) * yStep() + yMinValue();
		return { x, y };
	};

	const getPercentValues = (xPercent: number, yPercent: number) => {
		const x = xPercent * (xMaxValue() - xMinValue()) + xMinValue();
		const y = yPercent * (yMaxValue() - yMinValue()) + yMinValue();
		const roundedValues = getRoundedValues({ x, y });
		return {
			x: clamp(roundedValues.x, xMinValue(), xMaxValue()),
			y: clamp(roundedValues.y, yMinValue(), yMaxValue()),
		};
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
		xValue,
		yValue,
		xStep,
		yStep,
		xPageSize,
		yPageSize,
		xMaxValue,
		yMaxValue,
		xMinValue,
		yMinValue,
		setValue,
		setXValue,
		setYValue,
		incrementX,
		decrementX,
		incrementY,
		decrementY,
		getThumbPosition,
		isDragging,
		setIsDragging: updateDragging,
		channels,
		resetValue,
		setThumbPercent,
		setThumbValue: updateValue,
		getThumbPercent: getValuePercent,
		isDisabled: mergedProps.isDisabled!,
	};
}
