import {
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	type FormControlDescriptionCommonProps as RatingGroupDescriptionCommonProps,
	type FormControlDescriptionOptions as RatingGroupDescriptionOptions,
	type FormControlDescriptionProps as RatingGroupDescriptionProps,
	type FormControlDescriptionRenderProps as RatingGroupDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as RatingGroupErrorMessageCommonProps,
	type FormControlErrorMessageOptions as RatingGroupErrorMessageOptions,
	type FormControlErrorMessageProps as RatingGroupErrorMessageProps,
	type FormControlErrorMessageRenderProps as RatingGroupErrorMessageRenderProps,
} from "../form-control";

import {
	RatingGroupControl as Control,
	type RatingGroupControlCommonProps,
	type RatingGroupControlOptions,
	type RatingGroupControlProps,
	type RatingGroupControlRenderProps,
} from "./rating-group-control";
import {
	RatingGroupHiddenInput as HiddenInput,
	type RatingGroupHiddenInputProps,
} from "./rating-group-hidden-input";
import {
	RatingGroupItem as Item,
	type RatingGroupItemCommonProps,
	type RatingGroupItemOptions,
	type RatingGroupItemProps,
	type RatingGroupItemRenderProps,
} from "./rating-group-item";
import {
	RatingGroupItemControl as ItemControl,
	type RatingGroupItemControlCommonProps,
	type RatingGroupItemControlOptions,
	type RatingGroupItemControlProps,
	type RatingGroupItemControlRenderProps,
} from "./rating-group-item-control";
import {
	RatingGroupItemDescription as ItemDescription,
	type RatingGroupItemDescriptionCommonProps,
	type RatingGroupItemDescriptionOptions,
	type RatingGroupItemDescriptionProps,
	type RatingGroupItemDescriptionRenderProps,
} from "./rating-group-item-description";
import {
	RatingGroupItemLabel as ItemLabel,
	type RatingGroupItemLabelCommonProps,
	type RatingGroupItemLabelOptions,
	type RatingGroupItemLabelProps,
	type RatingGroupItemLabelRenderProps,
} from "./rating-group-item-label";
import {
	RatingGroupLabel as Label,
	type RatingGroupLabelCommonProps,
	type RatingGroupLabelOptions,
	type RatingGroupLabelProps,
	type RatingGroupLabelRenderProps,
} from "./rating-group-label";
import {
	type RatingGroupRootCommonProps,
	type RatingGroupRootOptions,
	type RatingGroupRootProps,
	type RatingGroupRootRenderProps,
	RatingGroupRoot as Root,
} from "./rating-group-root";

export type {
	RatingGroupControlCommonProps,
	RatingGroupControlOptions,
	RatingGroupControlProps,
	RatingGroupControlRenderProps,
	RatingGroupDescriptionOptions,
	RatingGroupDescriptionCommonProps,
	RatingGroupDescriptionRenderProps,
	RatingGroupDescriptionProps,
	RatingGroupErrorMessageOptions,
	RatingGroupErrorMessageCommonProps,
	RatingGroupErrorMessageRenderProps,
	RatingGroupErrorMessageProps,
	RatingGroupHiddenInputProps,
	RatingGroupItemControlOptions,
	RatingGroupItemControlCommonProps,
	RatingGroupItemControlRenderProps,
	RatingGroupItemControlProps,
	RatingGroupItemDescriptionOptions,
	RatingGroupItemDescriptionCommonProps,
	RatingGroupItemDescriptionRenderProps,
	RatingGroupItemDescriptionProps,
	RatingGroupItemLabelOptions,
	RatingGroupItemLabelCommonProps,
	RatingGroupItemLabelRenderProps,
	RatingGroupItemLabelProps,
	RatingGroupItemOptions,
	RatingGroupItemCommonProps,
	RatingGroupItemRenderProps,
	RatingGroupItemProps,
	RatingGroupLabelOptions,
	RatingGroupLabelCommonProps,
	RatingGroupLabelRenderProps,
	RatingGroupLabelProps,
	RatingGroupRootOptions,
	RatingGroupRootCommonProps,
	RatingGroupRootRenderProps,
	RatingGroupRootProps,
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

export const RatingGroup = Object.assign(Root, {
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
