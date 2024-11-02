import {
	type CheckboxControlCommonProps as CheckboxGroupItemControlCommonProps,
	type CheckboxControlOptions as CheckboxGroupItemControlOptions,
	type CheckboxControlProps as CheckboxGroupItemControlProps,
	type CheckboxControlRenderProps as CheckboxGroupItemControlRenderProps,
	CheckboxControl as ItemControl,
} from "../checkbox/checkbox-control";
import {
	type CheckboxDescriptionCommonProps as CheckboxGroupItemDescriptionCommonProps,
	type CheckboxDescriptionOptions as CheckboxGroupItemDescriptionOptions,
	type CheckboxDescriptionProps as CheckboxGroupItemDescriptionProps,
	type CheckboxDescriptionRenderProps as CheckboxGroupItemDescriptionRenderProps,
	CheckboxDescription as ItemDescription,
} from "../checkbox/checkbox-description";
import {
	type CheckboxIndicatorCommonProps as CheckboxGroupItemIndicatorCommonProps,
	type CheckboxIndicatorOptions as CheckboxGroupItemIndicatorOptions,
	type CheckboxIndicatorProps as CheckboxGroupItemIndicatorProps,
	type CheckboxIndicatorRenderProps as CheckboxGroupItemIndicatorRenderProps,
	CheckboxIndicator as ItemIndicator,
} from "../checkbox/checkbox-indicator";
import {
	type CheckboxLabelCommonProps as CheckboxGroupItemLabelCommonProps,
	type CheckboxLabelOptions as CheckboxGroupItemLabelOptions,
	type CheckboxLabelProps as CheckboxGroupItemLabelProps,
	type CheckboxLabelRenderProps as CheckboxGroupItemLabelRenderProps,
	CheckboxLabel as ItemLabel,
} from "../checkbox/checkbox-label";
import {
	type FormControlDescriptionCommonProps as CheckboxGroupDescriptionCommonProps,
	type FormControlDescriptionOptions as CheckboxGroupDescriptionOptions,
	type FormControlDescriptionProps as CheckboxGroupDescriptionProps,
	type FormControlDescriptionRenderProps as CheckboxGroupDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as CheckboxGroupErrorMessageCommonProps,
	type FormControlErrorMessageOptions as CheckboxGroupErrorMessageOptions,
	type FormControlErrorMessageProps as CheckboxGroupErrorMessageProps,
	type FormControlErrorMessageRenderProps as CheckboxGroupErrorMessageRenderProps,
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
} from "../form-control";
import {
	type CheckboxGroupItemCommonProps,
	type CheckboxGroupItemOptions,
	type CheckboxGroupItemProps,
	type CheckboxGroupItemRenderProps,
	CheckboxGroupItem as Item,
} from "./checkbox-group-item";
import {
	type CheckboxGroupItemInputCommonProps,
	type CheckboxGroupItemInputOptions,
	type CheckboxGroupItemInputProps,
	type CheckboxGroupItemInputRenderProps,
	CheckboxGroupItemInput as ItemInput,
} from "./checkbox-group-item-input";

import {
	type CheckboxGroupLabelCommonProps,
	type CheckboxGroupLabelOptions,
	type CheckboxGroupLabelProps,
	type CheckboxGroupLabelRenderProps,
	CheckboxGroupLabel as Label,
} from "./checkbox-group-label";
import {
	type CheckboxGroupRootCommonProps,
	type CheckboxGroupRootOptions,
	type CheckboxGroupRootProps,
	type CheckboxGroupRootRenderProps,
	CheckboxGroupRoot as Root,
} from "./checkbox-group-root";

export type {
	CheckboxGroupDescriptionOptions,
	CheckboxGroupDescriptionCommonProps,
	CheckboxGroupDescriptionRenderProps,
	CheckboxGroupDescriptionProps,
	CheckboxGroupErrorMessageOptions,
	CheckboxGroupErrorMessageCommonProps,
	CheckboxGroupErrorMessageRenderProps,
	CheckboxGroupErrorMessageProps,
	CheckboxGroupItemControlOptions,
	CheckboxGroupItemControlCommonProps,
	CheckboxGroupItemControlRenderProps,
	CheckboxGroupItemControlProps,
	CheckboxGroupItemDescriptionOptions,
	CheckboxGroupItemDescriptionCommonProps,
	CheckboxGroupItemDescriptionRenderProps,
	CheckboxGroupItemDescriptionProps,
	CheckboxGroupItemIndicatorOptions,
	CheckboxGroupItemIndicatorCommonProps,
	CheckboxGroupItemIndicatorRenderProps,
	CheckboxGroupItemIndicatorProps,
	CheckboxGroupItemInputOptions,
	CheckboxGroupItemInputCommonProps,
	CheckboxGroupItemInputRenderProps,
	CheckboxGroupItemInputProps,
	CheckboxGroupItemLabelOptions,
	CheckboxGroupItemLabelCommonProps,
	CheckboxGroupItemLabelRenderProps,
	CheckboxGroupItemLabelProps,
	CheckboxGroupItemOptions,
	CheckboxGroupItemCommonProps,
	CheckboxGroupItemRenderProps,
	CheckboxGroupItemProps,
	CheckboxGroupLabelOptions,
	CheckboxGroupLabelCommonProps,
	CheckboxGroupLabelRenderProps,
	CheckboxGroupLabelProps,
	CheckboxGroupRootOptions,
	CheckboxGroupRootCommonProps,
	CheckboxGroupRootRenderProps,
	CheckboxGroupRootProps,
};

export {
	Description,
	ErrorMessage,
	Item,
	ItemControl,
	ItemDescription,
	ItemIndicator,
	ItemInput,
	ItemLabel,
	Label,
	Root,
};

export const CheckboxGroup = Object.assign(Root, {
	Description,
	ErrorMessage,
	Item,
	ItemControl,
	ItemDescription,
	ItemIndicator,
	ItemInput,
	ItemLabel,
	Label,
});
