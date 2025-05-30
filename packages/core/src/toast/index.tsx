import {
	ToastCloseButton as CloseButton,
	type ToastCloseButtonCommonProps,
	type ToastCloseButtonOptions,
	type ToastCloseButtonProps,
	type ToastCloseButtonRenderProps,
} from "./toast-close-button";
import {
	ToastDescription as Description,
	type ToastDescriptionCommonProps,
	type ToastDescriptionOptions,
	type ToastDescriptionProps,
	type ToastDescriptionRenderProps,
} from "./toast-description";
import {
	ToastList as List,
	type ToastListCommonProps,
	type ToastListOptions,
	type ToastListProps,
	type ToastListRenderProps,
} from "./toast-list";
import {
	ToastProgressFill as ProgressFill,
	type ToastProgressFillCommonProps,
	type ToastProgressFillOptions,
	type ToastProgressFillProps,
	type ToastProgressFillRenderProps,
} from "./toast-progress-fill";
import {
	ToastProgressTrack as ProgressTrack,
	type ToastProgressTrackCommonProps,
	type ToastProgressTrackOptions,
	type ToastProgressTrackProps,
	type ToastProgressTrackRenderProps,
} from "./toast-progress-track";
import {
	ToastRegion as Region,
	type ToastRegionCommonProps,
	type ToastRegionOptions,
	type ToastRegionProps,
	type ToastRegionRenderProps,
} from "./toast-region";
import {
	ToastRoot as Root,
	type ToastRootCommonProps,
	type ToastRootOptions,
	type ToastRootProps,
	type ToastRootRenderProps,
} from "./toast-root";
import {
	ToastTitle as Title,
	type ToastTitleCommonProps,
	type ToastTitleOptions,
	type ToastTitleProps,
	type ToastTitleRenderProps,
} from "./toast-title";
import { toaster } from "./toaster";
import type {
	ToastComponent,
	ToastComponentProps,
	ToastPromiseComponent,
	ToastPromiseComponentProps,
	ToastPromiseState,
	ToastSwipeDirection,
} from "./types";

export type {
	ToastCloseButtonOptions,
	ToastCloseButtonCommonProps,
	ToastCloseButtonRenderProps,
	ToastCloseButtonProps,
	ToastComponent,
	ToastComponentProps,
	ToastDescriptionOptions,
	ToastDescriptionCommonProps,
	ToastDescriptionRenderProps,
	ToastDescriptionProps,
	ToastListOptions,
	ToastListCommonProps,
	ToastListRenderProps,
	ToastListProps,
	ToastProgressFillOptions,
	ToastProgressFillCommonProps,
	ToastProgressFillRenderProps,
	ToastProgressFillProps,
	ToastProgressTrackOptions,
	ToastProgressTrackCommonProps,
	ToastProgressTrackRenderProps,
	ToastProgressTrackProps,
	ToastPromiseComponent,
	ToastPromiseComponentProps,
	ToastPromiseState,
	ToastRegionOptions,
	ToastRegionCommonProps,
	ToastRegionRenderProps,
	ToastRegionProps,
	ToastRootOptions,
	ToastRootCommonProps,
	ToastRootRenderProps,
	ToastRootProps,
	ToastSwipeDirection,
	ToastTitleOptions,
	ToastTitleCommonProps,
	ToastTitleRenderProps,
	ToastTitleProps,
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
 * API will most probably change
 */
export { useToastContext, type ToastContextValue } from "./toast-context";
