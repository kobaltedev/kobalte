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
} from "../form-control";

import {
	RatingControl as Control,
	type RatingControlCommonProps,
	type RatingControlOptions,
	type RatingControlProps,
	type RatingControlRenderProps,
} from "./rating-control";
import {
	RatingHiddenInput as HiddenInput,
	type RatingHiddenInputProps,
} from "./rating-hidden-input";
import {
	RatingItem as Item,
	type RatingItemCommonProps,
	type RatingItemOptions,
	type RatingItemProps,
	type RatingItemRenderProps,
} from "./rating-item";
import {
	RatingItemControl as ItemControl,
	type RatingItemControlCommonProps,
	type RatingItemControlOptions,
	type RatingItemControlProps,
	type RatingItemControlRenderProps,
} from "./rating-item-control";
import {
	RatingItemDescription as ItemDescription,
	type RatingItemDescriptionCommonProps,
	type RatingItemDescriptionOptions,
	type RatingItemDescriptionProps,
	type RatingItemDescriptionRenderProps,
} from "./rating-item-description";
import {
	RatingItemLabel as ItemLabel,
	type RatingItemLabelCommonProps,
	type RatingItemLabelOptions,
	type RatingItemLabelProps,
	type RatingItemLabelRenderProps,
} from "./rating-item-label";
import {
	RatingLabel as Label,
	type RatingLabelCommonProps,
	type RatingLabelOptions,
	type RatingLabelProps,
	type RatingLabelRenderProps,
} from "./rating-label";
import {
	type RatingRootCommonProps,
	type RatingRootOptions,
	type RatingRootProps,
	type RatingRootRenderProps,
	RatingRoot as Root,
} from "./rating-root";

export type {
	RatingControlCommonProps,
	RatingControlOptions,
	RatingControlProps,
	RatingControlRenderProps,
	RatingDescriptionOptions,
	RatingDescriptionCommonProps,
	RatingDescriptionRenderProps,
	RatingDescriptionProps,
	RatingErrorMessageOptions,
	RatingErrorMessageCommonProps,
	RatingErrorMessageRenderProps,
	RatingErrorMessageProps,
	RatingHiddenInputProps,
	RatingItemControlOptions,
	RatingItemControlCommonProps,
	RatingItemControlRenderProps,
	RatingItemControlProps,
	RatingItemDescriptionOptions,
	RatingItemDescriptionCommonProps,
	RatingItemDescriptionRenderProps,
	RatingItemDescriptionProps,
	RatingItemLabelOptions,
	RatingItemLabelCommonProps,
	RatingItemLabelRenderProps,
	RatingItemLabelProps,
	RatingItemOptions,
	RatingItemCommonProps,
	RatingItemRenderProps,
	RatingItemProps,
	RatingLabelOptions,
	RatingLabelCommonProps,
	RatingLabelRenderProps,
	RatingLabelProps,
	RatingRootOptions,
	RatingRootCommonProps,
	RatingRootRenderProps,
	RatingRootProps,
};

export {
	Description,
	ErrorMessage,
	Control,
	HiddenInput,
	ItemControl,
	ItemDescription,
	ItemLabel,
	Item,
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
