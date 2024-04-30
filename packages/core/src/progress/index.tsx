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
	ProgressRoot as Root,
	type ProgressRootCommonProps,
	type ProgressRootOptions,
	type ProgressRootProps,
	type ProgressRootRenderProps,
} from "./progress-root";
import {
	ProgressTrack as Track,
	type ProgressTrackCommonProps,
	type ProgressTrackOptions,
	type ProgressTrackProps,
	type ProgressTrackRenderProps,
} from "./progress-track";
import {
	ProgressValueLabel as ValueLabel,
	type ProgressValueLabelCommonProps,
	type ProgressValueLabelOptions,
	type ProgressValueLabelProps,
	type ProgressValueLabelRenderProps,
} from "./progress-value-label";

export type {
	ProgressFillOptions,
	ProgressFillCommonProps,
	ProgressFillRenderProps,
	ProgressFillProps,
	ProgressLabelOptions,
	ProgressLabelCommonProps,
	ProgressLabelRenderProps,
	ProgressLabelProps,
	ProgressRootOptions,
	ProgressRootCommonProps,
	ProgressRootRenderProps,
	ProgressRootProps,
	ProgressTrackOptions,
	ProgressTrackCommonProps,
	ProgressTrackRenderProps,
	ProgressTrackProps,
	ProgressValueLabelOptions,
	ProgressValueLabelCommonProps,
	ProgressValueLabelRenderProps,
	ProgressValueLabelProps,
};
export { Fill, Label, Root, Track, ValueLabel };

export const Progress = Object.assign(Root, {
	Fill,
	Label,
	Track,
	ValueLabel,
});
