import {
	MeterFill as Fill,
	type MeterFillCommonProps,
	type MeterFillOptions,
	type MeterFillProps,
	type MeterFillRenderProps,
} from "./meter-fill";
import {
	MeterLabel as Label,
	type MeterLabelCommonProps,
	type MeterLabelOptions,
	type MeterLabelProps,
	type MeterLabelRenderProps,
} from "./meter-label";
import {
	type MeterRootCommonProps,
	type MeterRootOptions,
	type MeterRootProps,
	type MeterRootRenderProps,
	MeterRoot as Root,
} from "./meter-root";
import {
	type MeterTrackCommonProps,
	type MeterTrackOptions,
	type MeterTrackProps,
	type MeterTrackRenderProps,
	MeterTrack as Track,
} from "./meter-track";
import {
	type MeterValueLabelCommonProps,
	type MeterValueLabelOptions,
	type MeterValueLabelProps,
	type MeterValueLabelRenderProps,
	MeterValueLabel as ValueLabel,
} from "./meter-value-label";

export type {
	MeterFillCommonProps,
	MeterFillOptions,
	MeterFillProps,
	MeterFillRenderProps,
	MeterLabelCommonProps,
	MeterLabelOptions,
	MeterLabelProps,
	MeterLabelRenderProps,
	MeterRootCommonProps,
	MeterRootOptions,
	MeterRootProps,
	MeterRootRenderProps,
	MeterTrackCommonProps,
	MeterTrackOptions,
	MeterTrackProps,
	MeterTrackRenderProps,
	MeterValueLabelCommonProps,
	MeterValueLabelOptions,
	MeterValueLabelProps,
	MeterValueLabelRenderProps,
};
export { Fill, Label, Root, Track, ValueLabel };

export const Meter = Object.assign(Root, {
	Fill,
	Label,
	Track,
	ValueLabel,
});

/**
 * API will most probably change
 */
export { type MeterContextValue, useMeterContext } from "./meter-context";
