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
	type FileFieldRootOptions,
	type FileFieldRootProps,
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
	FileRejection,
	FileError,
	FileFieldContextValue,
	FileFieldLabelCommonProps,
	FileFieldDropzoneOptions,
	FileFieldDropzoneCommonProps,
	FileFieldDropzoneRenderProps,
	FileFieldDropzoneProps,
	FileFieldTriggerCommonProps,
	FileFieldHiddenInputProps,
	FileFieldItemRenderProps,
	FileFieldItemDeleteTriggerOptions,
	FileFieldItemDeleteTriggerRenderProps,
	FileFieldItemDeleteTriggerProps,
	FileFieldItemListOptions,
	FileFieldItemListCommonProps,
	FileFieldItemListRenderProps,
	FileFieldItemListProps,
	FileFieldItemNameOptions,
	FileFieldItemNameRenderProps,
	FileFieldItemNameProps,
	FileFieldItemPreviewRenderProps,
	FileFieldItemPreviewProps,
	FileFieldItemPreviewImageOptions,
	FileFieldItemPreviewImageCommonProps,
	FileFieldItemPreviewImageRenderProps,
	FileFieldItemSizeRenderProps,
	FileFieldItemSizeProps,
	FileFieldLabelOptions,
	FileFieldLabelRenderProps,
	FileFieldLabelProps,
	FileFieldTriggerProps,
	FileFieldItemOptions,
	FileFieldItemCommonProps,
	FileFieldItemRootProps,
	FileFieldItemPreviewOptions,
	FileFieldItemPreviewCommonProps,
	FileFieldItemPreviewImageProps,
	FileFieldItemSizeOptions,
	FileFieldItemSizeCommonProps,
	FileFieldItemDeleteTriggerCommonProps,
	FileFieldItemNameCommonProps,
	FileFieldRootOptions,
	FileFieldRootProps,
	FileFieldTriggerOptions,
	FileFieldTriggerRenderProps,
};

export {
	Root,
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
});
