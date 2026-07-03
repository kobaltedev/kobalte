import {
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	type FormControlDescriptionCommonProps as FileFieldDescriptionCommonProps,
	type FormControlDescriptionOptions as FileFieldDescriptionOptions,
	type FormControlDescriptionProps as FileFieldDescriptionProps,
	type FormControlDescriptionRenderProps as FileFieldDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as FileFieldErrorMessageCommonProps,
	type FormControlErrorMessageOptions as FileFieldErrorMessageOptions,
	type FormControlErrorMessageProps as FileFieldErrorMessageProps,
	type FormControlErrorMessageRenderProps as FileFieldErrorMessageRenderProps,
} from "../form-control";
import {
	FileFieldContext as Context,
	type FileFieldContextValue,
} from "./file-field-context";
import {
	FileFieldDropzone as Dropzone,
	type FileFieldDropzoneCommonProps,
	type FileFieldDropzoneOptions,
	type FileFieldDropzoneProps,
	type FileFieldDropzoneRenderProps,
} from "./file-field-dropzone";
import {
	type FileFieldHiddenInputProps,
	FileFieldHiddenInput as HiddenInput,
} from "./file-field-hidden-input";
import {
	type FileFieldItemCommonProps,
	type FileFieldItemOptions,
	type FileFieldItemRenderProps,
	type FileFieldItemRootProps,
	FileFieldItem as Item,
} from "./file-field-item";
import {
	type FileFieldItemDeleteTriggerCommonProps,
	type FileFieldItemDeleteTriggerOptions,
	type FileFieldItemDeleteTriggerProps,
	type FileFieldItemDeleteTriggerRenderProps,
	FileFieldItemDeleteTrigger as ItemDeleteTrigger,
} from "./file-field-item-delete-trigger";
import {
	type FileFieldItemListCommonProps,
	type FileFieldItemListOptions,
	type FileFieldItemListProps,
	type FileFieldItemListRenderProps,
	FileFieldItemList as ItemList,
} from "./file-field-item-list";
import {
	type FileFieldItemNameCommonProps,
	type FileFieldItemNameOptions,
	type FileFieldItemNameProps,
	type FileFieldItemNameRenderProps,
	FileFieldItemName as ItemName,
} from "./file-field-item-name";
import {
	type FileFieldItemPreviewCommonProps,
	type FileFieldItemPreviewOptions,
	type FileFieldItemPreviewProps,
	type FileFieldItemPreviewRenderProps,
	FileFieldItemPreview as ItemPreview,
} from "./file-field-item-preview";
import {
	type FileFieldItemPreviewImageCommonProps,
	type FileFieldItemPreviewImageOptions,
	type FileFieldItemPreviewImageProps,
	type FileFieldItemPreviewImageRenderProps,
	FileFieldItemPreviewImage as ItemPreviewImage,
} from "./file-field-item-preview-image";
import {
	type FileFieldItemSizeCommonProps,
	type FileFieldItemSizeOptions,
	type FileFieldItemSizeProps,
	type FileFieldItemSizeRenderProps,
	FileFieldItemSize as ItemSize,
} from "./file-field-item-size";
import {
	type FileFieldLabelCommonProps,
	type FileFieldLabelOptions,
	type FileFieldLabelProps,
	type FileFieldLabelRenderProps,
	FileFieldLabel as Label,
} from "./file-field-label";
import {
	type FileFieldRootCommonProps,
	type FileFieldRootOptions,
	type FileFieldRootProps,
	type FileFieldRootRenderProps,
	FileField as Root,
} from "./file-field-root";
import {
	type FileFieldTriggerCommonProps,
	type FileFieldTriggerOptions,
	type FileFieldTriggerProps,
	type FileFieldTriggerRenderProps,
	FileFieldTrigger as Trigger,
} from "./file-field-trigger";

import type { Accept, Details, FileError, FileRejection } from "./types";

export type {
	Accept,
	Details,
	FileError,
	FileFieldDescriptionCommonProps,
	FileFieldDescriptionOptions,
	FileFieldDescriptionProps,
	FileFieldDescriptionRenderProps,
	FileFieldDropzoneCommonProps,
	FileFieldDropzoneOptions,
	FileFieldDropzoneProps,
	FileFieldDropzoneRenderProps,
	FileFieldErrorMessageCommonProps,
	FileFieldErrorMessageOptions,
	FileFieldErrorMessageProps,
	FileFieldErrorMessageRenderProps,
	FileFieldHiddenInputProps,
	FileFieldItemCommonProps,
	FileFieldItemDeleteTriggerCommonProps,
	FileFieldItemDeleteTriggerOptions,
	FileFieldItemDeleteTriggerProps,
	FileFieldItemDeleteTriggerRenderProps,
	FileFieldItemListCommonProps,
	FileFieldItemListOptions,
	FileFieldItemListProps,
	FileFieldItemListRenderProps,
	FileFieldItemNameCommonProps,
	FileFieldItemNameOptions,
	FileFieldItemNameProps,
	FileFieldItemNameRenderProps,
	FileFieldItemOptions,
	FileFieldItemPreviewCommonProps,
	FileFieldItemPreviewImageCommonProps,
	FileFieldItemPreviewImageOptions,
	FileFieldItemPreviewImageProps,
	FileFieldItemPreviewImageRenderProps,
	FileFieldItemPreviewOptions,
	FileFieldItemPreviewProps,
	FileFieldItemPreviewRenderProps,
	FileFieldItemRenderProps,
	FileFieldItemRootProps,
	FileFieldItemSizeCommonProps,
	FileFieldItemSizeOptions,
	FileFieldItemSizeProps,
	FileFieldItemSizeRenderProps,
	FileFieldLabelCommonProps,
	FileFieldLabelOptions,
	FileFieldLabelProps,
	FileFieldLabelRenderProps,
	FileFieldRootCommonProps,
	FileFieldRootOptions,
	FileFieldRootProps,
	FileFieldRootRenderProps,
	FileFieldTriggerCommonProps,
	FileFieldTriggerOptions,
	FileFieldTriggerProps,
	FileFieldTriggerRenderProps,
	FileRejection,
};

export {
	Context,
	Description,
	Dropzone,
	ErrorMessage,
	HiddenInput,
	Item,
	ItemDeleteTrigger,
	ItemList,
	ItemName,
	ItemPreview,
	ItemPreviewImage,
	ItemSize,
	Label,
	Root,
	Trigger,
};

export const FileField = Object.assign(Root, {
	Context,
	Dropzone,
	HiddenInput,
	Label,
	Trigger,
	ItemList,
	Item,
	ItemPreview,
	ItemPreviewImage,
	ItemSize,
	ItemDeleteTrigger,
	ItemName,
	Description,
	ErrorMessage,
});

/**
 * API will most probably change
 */
export {
	type FileFieldContextValue,
	useFileFieldContext,
} from "./file-field-context";
