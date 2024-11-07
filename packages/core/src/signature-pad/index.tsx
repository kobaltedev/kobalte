import {
	SignaturePadClearTrigger as ClearTrigger,
	type SignaturePadClearTriggerCommonProps,
	type SignaturePadClearTriggerOptions,
	type SignaturePadClearTriggerRenderProps,
	type SignaturePadClearTriggerRootProps,
} from "./signature-pad-clear-trigger";
import {
	FileUploadContext as Context,
	type FileUploadContextProps,
} from "./signature-pad-context";
import {
	SignaturePadControl as Control,
	type SignaturePadControlCommonProps,
	type SignaturePadControlRootProps,
} from "./signature-pad-control";
import {
	SignaturePadGuide as Guide,
	type SignaturePadGuideCommonProps,
	type SignaturePadGuideRootProps,
} from "./signature-pad-guide";
import {
	SignaturePadHiddenInput as HiddenInput,
	type SignaturePadHiddenInputCommonProps,
	type SignaturePadHiddenInputRootProps,
} from "./signature-pad-hidden-input";
import {
	SignaturePadLabel as Label,
	type SignaturePadLabelCommonProps,
	type SignaturePadLabelRootProps,
} from "./signature-pad-label";
import {
	SignaturePadProvider as Provider,
	type SignaturePadContextValue,
} from "./signature-pad-provider";
import {
	SignaturePad as Root,
	type SignaturePadRootCommonProps,
	type SignaturePadRootProps,
} from "./signature-pad-root";
import {
	SignaturePadSegment as Segment,
	type SignaturePadSegmentCommonProps,
	type SignaturePadSegmentRootProps,
} from "./signature-pad-segment";

import type {
	DataUrlOptions,
	DataUrlType,
	DrawingDetails,
	DrawingEndDetails,
	DrawingOptions,
	Point,
	SignaturePadRootOptions,
} from "./types";

export type {
	SignaturePadRootCommonProps,
	SignaturePadRootProps,
	SignaturePadControlCommonProps,
	SignaturePadControlRootProps,
	SignaturePadLabelCommonProps,
	SignaturePadLabelRootProps,
	SignaturePadSegmentCommonProps,
	SignaturePadSegmentRootProps,
	SignaturePadGuideCommonProps,
	SignaturePadGuideRootProps,
	SignaturePadClearTriggerOptions,
	SignaturePadClearTriggerCommonProps,
	SignaturePadClearTriggerRenderProps,
	SignaturePadClearTriggerRootProps,
	SignaturePadHiddenInputCommonProps,
	SignaturePadHiddenInputRootProps,
	SignaturePadContextValue,
	DataUrlOptions,
	DataUrlType,
	DrawingDetails,
	DrawingEndDetails,
	DrawingOptions,
	Point,
	SignaturePadRootOptions,
};

export {
	Root,
	Context,
	Control,
	Label,
	Segment,
	Guide,
	ClearTrigger,
	HiddenInput,
	Provider,
};

export const SignaturePad = Object.assign(Root, {
	Context,
	Control,
	Label,
	Segment,
	Guide,
	ClearTrigger,
	HiddenInput,
	Provider,
});
