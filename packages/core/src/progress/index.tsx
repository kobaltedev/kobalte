import {
	ProgressFill as Fill,
	type ProgressFillCommonProps,
	type ProgressFillOptions,
	type ProgressFillProps,
	type ProgressFillRenderProps,
} from "./progress-fill";
import {
	ProgressLabel as Label,
	type ProgressLabelCommonProps,
	type ProgressLabelOptions,
	type ProgressLabelProps,
	type ProgressLabelRenderProps,
} from "./progress-label";
import {
	type ProgressRootCommonProps,
	type ProgressRootOptions,
	type ProgressRootProps,
	type ProgressRootRenderProps,
	ProgressRoot as Root,
} from "./progress-root";
import {
	type ProgressTrackCommonProps,
	type ProgressTrackOptions,
	type ProgressTrackProps,
	type ProgressTrackRenderProps,
	ProgressTrack as Track,
} from "./progress-track";
import {
	type ProgressValueLabelCommonProps,
	type ProgressValueLabelOptions,
	type ProgressValueLabelProps,
	type ProgressValueLabelRenderProps,
	ProgressValueLabel as ValueLabel,
} from "./progress-value-label";

export type {
	ProgressFillCommonProps,
	ProgressFillOptions,
	ProgressFillProps,
	ProgressFillRenderProps,
	ProgressLabelCommonProps,
	ProgressLabelOptions,
	ProgressLabelProps,
	ProgressLabelRenderProps,
	ProgressRootCommonProps,
	ProgressRootOptions,
	ProgressRootProps,
	ProgressRootRenderProps,
	ProgressTrackCommonProps,
	ProgressTrackOptions,
	ProgressTrackProps,
	ProgressTrackRenderProps,
	ProgressValueLabelCommonProps,
	ProgressValueLabelOptions,
	ProgressValueLabelProps,
	ProgressValueLabelRenderProps,
};
export { Fill, Label, Root, Track, ValueLabel };

export const Progress = Object.assign(Root, {
	Fill,
	Label,
	Track,
	ValueLabel,
});

/**
 * API will most probably change
 */
export {
	type ProgressContextValue,
	useProgressContext,
} from "./progress-context";
