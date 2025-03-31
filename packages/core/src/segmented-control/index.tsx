import {
	Description,
	ErrorMessage,
	ItemControl,
	ItemDescription,
	ItemIndicator,
	ItemLabel,
	Label,
	type RadioGroupDescriptionCommonProps as SegmentedControlDescriptionCommonProps,
	type RadioGroupDescriptionOptions as SegmentedControlDescriptionOptions,
	type RadioGroupDescriptionProps as SegmentedControlDescriptionProps,
	type RadioGroupDescriptionRenderProps as SegmentedControlDescriptionRenderProps,
	type RadioGroupErrorMessageCommonProps as SegmentedControlErrorMessageCommonProps,
	type RadioGroupErrorMessageOptions as SegmentedControlErrorMessageOptions,
	type RadioGroupErrorMessageProps as SegmentedControlErrorMessageProps,
	type RadioGroupErrorMessageRenderProps as SegmentedControlErrorMessageRenderProps,
	type RadioGroupItemControlCommonProps as SegmentedControlItemControlCommonProps,
	type RadioGroupItemControlOptions as SegmentedControlItemControlOptions,
	type RadioGroupItemControlProps as SegmentedControlItemControlProps,
	type RadioGroupItemControlRenderProps as SegmentedControlItemControlRenderProps,
	type RadioGroupItemDescriptionCommonProps as SegmentedControlItemDescriptionCommonProps,
	type RadioGroupItemDescriptionOptions as SegmentedControlItemDescriptionOptions,
	type RadioGroupItemDescriptionProps as SegmentedControlItemDescriptionProps,
	type RadioGroupItemDescriptionRenderProps as SegmentedControlItemDescriptionRenderProps,
	type RadioGroupItemIndicatorCommonProps as SegmentedControlItemIndicatorCommonProps,
	type RadioGroupItemIndicatorOptions as SegmentedControlItemIndicatorOptions,
	type RadioGroupItemIndicatorProps as SegmentedControlItemIndicatorProps,
	type RadioGroupItemIndicatorRenderProps as SegmentedControlItemIndicatorRenderProps,
	type RadioGroupItemLabelCommonProps as SegmentedControlItemLabelCommonProps,
	type RadioGroupItemLabelOptions as SegmentedControlItemLabelOptions,
	type RadioGroupItemLabelProps as SegmentedControlItemLabelProps,
	type RadioGroupItemLabelRenderProps as SegmentedControlItemLabelRenderProps,
} from "../radio-group";
import {
	SegmentedControlIndicator as Indicator,
	type SegmentedControlIndicatorCommonProps,
	type SegmentedControlIndicatorOptions,
	type SegmentedControlIndicatorProps,
	type SegmentedControlIndicatorRenderProps,
} from "./segmented-control-indicator";
import {
	SegmentedControlItem as Item,
	type SegmentedControlItemCommonProps,
	type SegmentedControlItemOptions,
	type SegmentedControlItemProps,
	type SegmentedControlItemRenderProps,
} from "./segmented-control-item";
import {
	SegmentedControlItemInput as ItemInput,
	type SegmentedControlItemInputCommonProps,
	type SegmentedControlItemInputOptions,
	type SegmentedControlItemInputProps,
	type SegmentedControlItemInputRenderProps,
} from "./segmented-control-item-input";
import {
	SegmentedControlRoot as Root,
	type SegmentedControlRootProps,
} from "./segmented-control-root";

export type {
	SegmentedControlDescriptionCommonProps,
	SegmentedControlDescriptionOptions,
	SegmentedControlDescriptionProps,
	SegmentedControlDescriptionRenderProps,
	SegmentedControlErrorMessageCommonProps,
	SegmentedControlErrorMessageOptions,
	SegmentedControlErrorMessageProps,
	SegmentedControlErrorMessageRenderProps,
	SegmentedControlIndicatorCommonProps,
	SegmentedControlIndicatorOptions,
	SegmentedControlIndicatorProps,
	SegmentedControlIndicatorRenderProps,
	SegmentedControlItemCommonProps,
	SegmentedControlItemControlCommonProps,
	SegmentedControlItemControlOptions,
	SegmentedControlItemControlProps,
	SegmentedControlItemControlRenderProps,
	SegmentedControlItemDescriptionCommonProps,
	SegmentedControlItemDescriptionOptions,
	SegmentedControlItemDescriptionProps,
	SegmentedControlItemDescriptionRenderProps,
	SegmentedControlItemIndicatorCommonProps,
	SegmentedControlItemIndicatorOptions,
	SegmentedControlItemIndicatorProps,
	SegmentedControlItemIndicatorRenderProps,
	SegmentedControlItemInputCommonProps,
	SegmentedControlItemInputOptions,
	SegmentedControlItemInputProps,
	SegmentedControlItemInputRenderProps,
	SegmentedControlItemLabelCommonProps,
	SegmentedControlItemLabelOptions,
	SegmentedControlItemLabelProps,
	SegmentedControlItemLabelRenderProps,
	SegmentedControlItemOptions,
	SegmentedControlItemProps,
	SegmentedControlItemRenderProps,
	SegmentedControlRootProps,
};

export {
	Description,
	ErrorMessage,
	Indicator,
	Item,
	ItemControl,
	ItemDescription,
	ItemIndicator,
	ItemInput,
	ItemLabel,
	Label,
	Root,
};

export const SegmentedControl = Object.assign(Root, {
	Description,
	ErrorMessage,
	Indicator,
	Item,
	ItemControl,
	ItemDescription,
	ItemIndicator,
	ItemInput,
	ItemLabel,
	Label,
});
