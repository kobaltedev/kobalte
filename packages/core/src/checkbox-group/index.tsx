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
	type CheckboxGroupItemControlCommonProps,
	type CheckboxGroupItemControlOptions,
	type CheckboxGroupItemControlProps,
	type CheckboxGroupItemControlRenderProps,
	CheckboxGroupItemControl as ItemControl,
} from "./checkbox-group-item-control";
import {
	type CheckboxGroupItemDescriptionCommonProps,
	type CheckboxGroupItemDescriptionOptions,
	type CheckboxGroupItemDescriptionProps,
	type CheckboxGroupItemDescriptionRenderProps,
	CheckboxGroupItemDescription as ItemDescription,
} from "./checkbox-group-item-description";
import {
	type CheckboxGroupItemIndicatorCommonProps,
	type CheckboxGroupItemIndicatorOptions,
	type CheckboxGroupItemIndicatorProps,
	type CheckboxGroupItemIndicatorRenderProps,
	CheckboxGroupItemIndicator as ItemIndicator,
} from "./checkbox-group-item-indicator";
import {
	type CheckboxGroupItemInputCommonProps,
	type CheckboxGroupItemInputOptions,
	type CheckboxGroupItemInputProps,
	type CheckboxGroupItemInputRenderProps,
	CheckboxGroupItemInput as ItemInput,
} from "./checkbox-group-item-input";
import {
	type CheckboxGroupItemLabelCommonProps,
	type CheckboxGroupItemLabelOptions,
	type CheckboxGroupItemLabelProps,
	type CheckboxGroupItemLabelRenderProps,
	CheckboxGroupItemLabel as ItemLabel,
} from "./checkbox-group-item-label";
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
