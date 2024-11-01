import {
	FileTriggerButton as Button,
	type FileTriggerButtonCommonProps,
	type FileTriggerButtonOptions,
	type FileTriggerButtonProps,
	type FileTriggerButtonRenderProps,
} from "./file-trigger-button";
import { type FileTriggerInputProps, FileTriggerInput as Input } from "./file-trigger-input";
import {
	type FileTriggerRootCommonProps,
	type FileTriggerRootOptions,
	type FileTriggerRootProps,
	type FileTriggerRootRenderProps,
	FileTriggerRoot as Root,
} from "./file-trigger-root";

export type {
	FileTriggerButtonOptions,
	FileTriggerButtonCommonProps,
	FileTriggerButtonRenderProps,
	FileTriggerButtonProps,
	FileTriggerInputProps,
	FileTriggerRootOptions,
	FileTriggerRootCommonProps,
	FileTriggerRootRenderProps,
	FileTriggerRootProps,
};
export { Button, Input, Root };

export const FileTrigger = Object.assign(Root, {
	Button,
	Input,
});
