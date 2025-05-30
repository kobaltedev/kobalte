import {
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	type FormControlDescriptionCommonProps as RadioGroupDescriptionCommonProps,
	type FormControlDescriptionOptions as RadioGroupDescriptionOptions,
	type FormControlDescriptionProps as RadioGroupDescriptionProps,
	type FormControlDescriptionRenderProps as RadioGroupDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as RadioGroupErrorMessageCommonProps,
	type FormControlErrorMessageOptions as RadioGroupErrorMessageOptions,
	type FormControlErrorMessageProps as RadioGroupErrorMessageProps,
	type FormControlErrorMessageRenderProps as RadioGroupErrorMessageRenderProps,
} from "../form-control";
import {
	RadioGroupItem as Item,
	type RadioGroupItemCommonProps,
	type RadioGroupItemOptions,
	type RadioGroupItemProps,
	type RadioGroupItemRenderProps,
} from "./radio-group-item";
import {
	RadioGroupItemControl as ItemControl,
	type RadioGroupItemControlCommonProps,
	type RadioGroupItemControlOptions,
	type RadioGroupItemControlProps,
	type RadioGroupItemControlRenderProps,
} from "./radio-group-item-control";
import {
	RadioGroupItemDescription as ItemDescription,
	type RadioGroupItemDescriptionCommonProps,
	type RadioGroupItemDescriptionOptions,
	type RadioGroupItemDescriptionProps,
	type RadioGroupItemDescriptionRenderProps,
} from "./radio-group-item-description";
import {
	RadioGroupItemIndicator as ItemIndicator,
	type RadioGroupItemIndicatorCommonProps,
	type RadioGroupItemIndicatorOptions,
	type RadioGroupItemIndicatorProps,
	type RadioGroupItemIndicatorRenderProps,
} from "./radio-group-item-indicator";
import {
	RadioGroupItemInput as ItemInput,
	type RadioGroupItemInputCommonProps,
	type RadioGroupItemInputOptions,
	type RadioGroupItemInputProps,
	type RadioGroupItemInputRenderProps,
} from "./radio-group-item-input";
import {
	RadioGroupItemLabel as ItemLabel,
	type RadioGroupItemLabelCommonProps,
	type RadioGroupItemLabelOptions,
	type RadioGroupItemLabelProps,
	type RadioGroupItemLabelRenderProps,
} from "./radio-group-item-label";
import {
	RadioGroupLabel as Label,
	type RadioGroupLabelCommonProps,
	type RadioGroupLabelOptions,
	type RadioGroupLabelProps,
	type RadioGroupLabelRenderProps,
} from "./radio-group-label";
import {
	type RadioGroupRootCommonProps,
	type RadioGroupRootOptions,
	type RadioGroupRootProps,
	type RadioGroupRootRenderProps,
	RadioGroupRoot as Root,
} from "./radio-group-root";

export type {
	RadioGroupDescriptionOptions,
	RadioGroupDescriptionCommonProps,
	RadioGroupDescriptionRenderProps,
	RadioGroupDescriptionProps,
	RadioGroupErrorMessageOptions,
	RadioGroupErrorMessageCommonProps,
	RadioGroupErrorMessageRenderProps,
	RadioGroupErrorMessageProps,
	RadioGroupItemControlOptions,
	RadioGroupItemControlCommonProps,
	RadioGroupItemControlRenderProps,
	RadioGroupItemControlProps,
	RadioGroupItemDescriptionOptions,
	RadioGroupItemDescriptionCommonProps,
	RadioGroupItemDescriptionRenderProps,
	RadioGroupItemDescriptionProps,
	RadioGroupItemIndicatorOptions,
	RadioGroupItemIndicatorCommonProps,
	RadioGroupItemIndicatorRenderProps,
	RadioGroupItemIndicatorProps,
	RadioGroupItemInputOptions,
	RadioGroupItemInputCommonProps,
	RadioGroupItemInputRenderProps,
	RadioGroupItemInputProps,
	RadioGroupItemLabelOptions,
	RadioGroupItemLabelCommonProps,
	RadioGroupItemLabelRenderProps,
	RadioGroupItemLabelProps,
	RadioGroupItemOptions,
	RadioGroupItemCommonProps,
	RadioGroupItemRenderProps,
	RadioGroupItemProps,
	RadioGroupLabelOptions,
	RadioGroupLabelCommonProps,
	RadioGroupLabelRenderProps,
	RadioGroupLabelProps,
	RadioGroupRootOptions,
	RadioGroupRootCommonProps,
	RadioGroupRootRenderProps,
	RadioGroupRootProps,
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

export const RadioGroup = Object.assign(Root, {
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

/**
 * API will most probably change
 */
export {
	useRadioGroupContext,
	type RadioGroupContextValue,
} from "./radio-group-context";
