import {
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	type FormControlDescriptionCommonProps as RatingDescriptionCommonProps,
	type FormControlDescriptionOptions as RatingDescriptionOptions,
	type FormControlDescriptionProps as RatingDescriptionProps,
	type FormControlDescriptionRenderProps as RatingDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as RatingErrorMessageCommonProps,
	type FormControlErrorMessageOptions as RatingErrorMessageOptions,
	type FormControlErrorMessageProps as RatingErrorMessageProps,
	type FormControlErrorMessageRenderProps as RatingErrorMessageRenderProps,
} from "../form-control/index.ts";

import {
	RatingControl as Control,
	type RatingControlCommonProps,
	type RatingControlOptions,
	type RatingControlProps,
	type RatingControlRenderProps,
} from "./rating-control.tsx";
import {
	RatingHiddenInput as HiddenInput,
	type RatingHiddenInputProps,
} from "./rating-hidden-input.tsx";
import {
	RatingItem as Item,
	type RatingItemCommonProps,
	type RatingItemOptions,
	type RatingItemProps,
	type RatingItemRenderProps,
} from "./rating-item.tsx";
import {
	RatingItemControl as ItemControl,
	type RatingItemControlCommonProps,
	type RatingItemControlOptions,
	type RatingItemControlProps,
	type RatingItemControlRenderProps,
} from "./rating-item-control.tsx";
import {
	RatingItemDescription as ItemDescription,
	type RatingItemDescriptionCommonProps,
	type RatingItemDescriptionOptions,
	type RatingItemDescriptionProps,
	type RatingItemDescriptionRenderProps,
} from "./rating-item-description.tsx";
import {
	RatingItemLabel as ItemLabel,
	type RatingItemLabelCommonProps,
	type RatingItemLabelOptions,
	type RatingItemLabelProps,
	type RatingItemLabelRenderProps,
} from "./rating-item-label.tsx";
import {
	RatingLabel as Label,
	type RatingLabelCommonProps,
	type RatingLabelOptions,
	type RatingLabelProps,
	type RatingLabelRenderProps,
} from "./rating-label.tsx";
import {
	type RatingRootCommonProps,
	type RatingRootOptions,
	type RatingRootProps,
	type RatingRootRenderProps,
	RatingRoot as Root,
} from "./rating-root.tsx";

export type {
	RatingControlCommonProps,
	RatingControlOptions,
	RatingControlProps,
	RatingControlRenderProps,
	RatingDescriptionCommonProps,
	RatingDescriptionOptions,
	RatingDescriptionProps,
	RatingDescriptionRenderProps,
	RatingErrorMessageCommonProps,
	RatingErrorMessageOptions,
	RatingErrorMessageProps,
	RatingErrorMessageRenderProps,
	RatingHiddenInputProps,
	RatingItemCommonProps,
	RatingItemControlCommonProps,
	RatingItemControlOptions,
	RatingItemControlProps,
	RatingItemControlRenderProps,
	RatingItemDescriptionCommonProps,
	RatingItemDescriptionOptions,
	RatingItemDescriptionProps,
	RatingItemDescriptionRenderProps,
	RatingItemLabelCommonProps,
	RatingItemLabelOptions,
	RatingItemLabelProps,
	RatingItemLabelRenderProps,
	RatingItemOptions,
	RatingItemProps,
	RatingItemRenderProps,
	RatingLabelCommonProps,
	RatingLabelOptions,
	RatingLabelProps,
	RatingLabelRenderProps,
	RatingRootCommonProps,
	RatingRootOptions,
	RatingRootProps,
	RatingRootRenderProps,
};

export {
	Control,
	Description,
	ErrorMessage,
	HiddenInput,
	Item,
	ItemControl,
	ItemDescription,
	ItemLabel,
	Label,
	Root,
};

export const Rating = Object.assign(Root, {
	Description,
	ErrorMessage,
	Control,
	HiddenInput,
	ItemControl,
	ItemDescription,
	ItemLabel,
	Item,
	Label,
});
