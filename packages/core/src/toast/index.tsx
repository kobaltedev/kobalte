import {
	ToastCloseButton as CloseButton,
	type ToastCloseButtonCommonProps,
	type ToastCloseButtonOptions,
	type ToastCloseButtonProps,
	type ToastCloseButtonRenderProps,
} from "./toast-close-button.tsx";
import {
	ToastDescription as Description,
	type ToastDescriptionCommonProps,
	type ToastDescriptionOptions,
	type ToastDescriptionProps,
	type ToastDescriptionRenderProps,
} from "./toast-description.tsx";
import {
	ToastList as List,
	type ToastListCommonProps,
	type ToastListOptions,
	type ToastListProps,
	type ToastListRenderProps,
} from "./toast-list.tsx";
import {
	ToastProgressFill as ProgressFill,
	type ToastProgressFillCommonProps,
	type ToastProgressFillOptions,
	type ToastProgressFillProps,
	type ToastProgressFillRenderProps,
} from "./toast-progress-fill.tsx";
import {
	ToastProgressTrack as ProgressTrack,
	type ToastProgressTrackCommonProps,
	type ToastProgressTrackOptions,
	type ToastProgressTrackProps,
	type ToastProgressTrackRenderProps,
} from "./toast-progress-track.tsx";
import {
	ToastRegion as Region,
	type ToastRegionCommonProps,
	type ToastRegionOptions,
	type ToastRegionProps,
	type ToastRegionRenderProps,
} from "./toast-region.tsx";
import {
	ToastRoot as Root,
	type ToastRootCommonProps,
	type ToastRootOptions,
	type ToastRootProps,
	type ToastRootRenderProps,
} from "./toast-root.tsx";
import {
	ToastTitle as Title,
	type ToastTitleCommonProps,
	type ToastTitleOptions,
	type ToastTitleProps,
	type ToastTitleRenderProps,
} from "./toast-title.tsx";
import { toaster } from "./toaster.ts";
import type {
	ToastComponent,
	ToastComponentProps,
	ToastPromiseComponent,
	ToastPromiseComponentProps,
	ToastPromiseState,
	ToastSwipeDirection,
} from "./types.ts";

export type {
	ToastCloseButtonCommonProps,
	ToastCloseButtonOptions,
	ToastCloseButtonProps,
	ToastCloseButtonRenderProps,
	ToastComponent,
	ToastComponentProps,
	ToastDescriptionCommonProps,
	ToastDescriptionOptions,
	ToastDescriptionProps,
	ToastDescriptionRenderProps,
	ToastListCommonProps,
	ToastListOptions,
	ToastListProps,
	ToastListRenderProps,
	ToastProgressFillCommonProps,
	ToastProgressFillOptions,
	ToastProgressFillProps,
	ToastProgressFillRenderProps,
	ToastProgressTrackCommonProps,
	ToastProgressTrackOptions,
	ToastProgressTrackProps,
	ToastProgressTrackRenderProps,
	ToastPromiseComponent,
	ToastPromiseComponentProps,
	ToastPromiseState,
	ToastRegionCommonProps,
	ToastRegionOptions,
	ToastRegionProps,
	ToastRegionRenderProps,
	ToastRootCommonProps,
	ToastRootOptions,
	ToastRootProps,
	ToastRootRenderProps,
	ToastSwipeDirection,
	ToastTitleCommonProps,
	ToastTitleOptions,
	ToastTitleProps,
	ToastTitleRenderProps,
};

export {
	CloseButton,
	Description,
	List,
	ProgressFill,
	ProgressTrack,
	Region,
	Root,
	Title,
	toaster,
};

export const Toast = Object.assign(Root, {
	CloseButton,
	Description,
	List,
	ProgressFill,
	ProgressTrack,
	Region,
	Title,
	toaster,
});

/**
 * API will most change
 */
export { type ToastContextValue, useToastContext } from "./toast-context.tsx";
