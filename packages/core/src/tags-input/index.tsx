import {
	TagsInputClearTrigger as ClearTrigger,
	type TagsInputClearTriggerCommonProps,
	type TagsInputClearTriggerOptions,
	type TagsInputClearTriggerProps,
	type TagsInputClearTriggerRenderProps,
} from "./tags-input-clear-trigger";
import {
	TagsInputControl as Control,
	type TagsInputControlCommonProps,
	type TagsInputControlOptions,
	type TagsInputControlProps,
	type TagsInputControlRenderProps,
} from "./tags-input-control";
import {
	TagsInputDescription as Description,
	type TagsInputDescriptionCommonProps,
	type TagsInputDescriptionOptions,
	type TagsInputDescriptionProps,
	type TagsInputDescriptionRenderProps,
} from "./tags-input-description";
import {
	TagsInputErrorMessage as ErrorMessage,
	type TagsInputErrorMessageCommonProps,
	type TagsInputErrorMessageOptions,
	type TagsInputErrorMessageProps,
	type TagsInputErrorMessageRenderProps,
} from "./tags-input-error-message";
import {
	TagsInputHiddenInput as HiddenInput,
	type TagsInputHiddenInputProps,
} from "./tags-input-hidden-input";
import {
	TagsInputInput as Input,
	type TagsInputInputCommonProps,
	type TagsInputInputOptions,
	type TagsInputInputProps,
	type TagsInputInputRenderProps,
} from "./tags-input-input";
import {
	TagsInputItem as Item,
	type TagsInputItemCommonProps,
	type TagsInputItemOptions,
	type TagsInputItemProps,
	type TagsInputItemRenderProps,
} from "./tags-input-item";
import {
	TagsInputItemDeleteTrigger as ItemDeleteTrigger,
	type TagsInputItemDeleteTriggerCommonProps,
	type TagsInputItemDeleteTriggerOptions,
	type TagsInputItemDeleteTriggerProps,
	type TagsInputItemDeleteTriggerRenderProps,
} from "./tags-input-item-delete-trigger";
import {
	TagsInputItemInput as ItemInput,
	type TagsInputItemInputOptions,
	type TagsInputItemInputProps,
} from "./tags-input-item-input";
import {
	TagsInputItemPreview as ItemPreview,
	type TagsInputItemPreviewCommonProps,
	type TagsInputItemPreviewOptions,
	type TagsInputItemPreviewProps,
	type TagsInputItemPreviewRenderProps,
} from "./tags-input-item-preview";
import {
	TagsInputItemText as ItemText,
	type TagsInputItemTextCommonProps,
	type TagsInputItemTextOptions,
	type TagsInputItemTextProps,
	type TagsInputItemTextRenderProps,
} from "./tags-input-item-text";
import {
	TagsInputLabel as Label,
	type TagsInputLabelCommonProps,
	type TagsInputLabelOptions,
	type TagsInputLabelProps,
	type TagsInputLabelRenderProps,
} from "./tags-input-label";
import {
	type TagsInputRootCommonProps,
	type TagsInputRootOptions,
	type TagsInputRootProps,
	type TagsInputRootRenderProps,
	TagsInputRoot as Root,
	type TagsInputValidateDetails,
} from "./tags-input-root";

export type {
	TagsInputClearTriggerCommonProps,
	TagsInputClearTriggerOptions,
	TagsInputClearTriggerProps,
	TagsInputClearTriggerRenderProps,
	TagsInputControlCommonProps,
	TagsInputControlOptions,
	TagsInputControlProps,
	TagsInputControlRenderProps,
	TagsInputDescriptionCommonProps,
	TagsInputDescriptionOptions,
	TagsInputDescriptionProps,
	TagsInputDescriptionRenderProps,
	TagsInputErrorMessageCommonProps,
	TagsInputErrorMessageOptions,
	TagsInputErrorMessageProps,
	TagsInputErrorMessageRenderProps,
	TagsInputHiddenInputProps,
	TagsInputInputCommonProps,
	TagsInputInputOptions,
	TagsInputInputProps,
	TagsInputInputRenderProps,
	TagsInputItemCommonProps,
	TagsInputItemDeleteTriggerCommonProps,
	TagsInputItemDeleteTriggerOptions,
	TagsInputItemDeleteTriggerProps,
	TagsInputItemDeleteTriggerRenderProps,
	TagsInputItemInputOptions,
	TagsInputItemInputProps,
	TagsInputItemOptions,
	TagsInputItemPreviewCommonProps,
	TagsInputItemPreviewOptions,
	TagsInputItemPreviewProps,
	TagsInputItemPreviewRenderProps,
	TagsInputItemProps,
	TagsInputItemRenderProps,
	TagsInputItemTextCommonProps,
	TagsInputItemTextOptions,
	TagsInputItemTextProps,
	TagsInputItemTextRenderProps,
	TagsInputLabelCommonProps,
	TagsInputLabelOptions,
	TagsInputLabelProps,
	TagsInputLabelRenderProps,
	TagsInputRootCommonProps,
	TagsInputRootOptions,
	TagsInputRootProps,
	TagsInputRootRenderProps,
	TagsInputValidateDetails,
};

export {
	ClearTrigger,
	Control,
	Description,
	ErrorMessage,
	HiddenInput,
	Input,
	Item,
	ItemDeleteTrigger,
	ItemInput,
	ItemPreview,
	ItemText,
	Label,
	Root,
};

export const TagsInput = Object.assign(Root, {
	ClearTrigger,
	Control,
	Description,
	ErrorMessage,
	HiddenInput,
	Input,
	Item,
	ItemDeleteTrigger,
	ItemInput,
	ItemPreview,
	ItemText,
	Label,
});

export {
	type TagsInputContextValue,
	useTagsInputContext,
} from "./tags-input-context";
export {
	type TagsInputItemContextValue,
	useTagsInputItemContext,
} from "./tags-input-item-context";
