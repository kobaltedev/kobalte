import {
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	type FormControlDescriptionCommonProps as PinInputDescriptionCommonProps,
	type FormControlDescriptionOptions as PinInputDescriptionOptions,
	type FormControlDescriptionProps as PinInputDescriptionProps,
	type FormControlDescriptionRenderProps as PinInputDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as PinInputErrorMessageCommonProps,
	type FormControlErrorMessageOptions as PinInputErrorMessageOptions,
	type FormControlErrorMessageProps as PinInputErrorMessageProps,
	type FormControlErrorMessageRenderProps as PinInputErrorMessageRenderProps,
} from "../form-control";
import {
	PinInputControl as Control,
	type PinInputControlCommonProps,
	type PinInputControlOptions,
	type PinInputControlProps,
	type PinInputControlRenderProps,
} from "./pin-input-control";
import {
	PinInputHiddenInput as HiddenInput,
	type PinInputHiddenInputProps,
} from "./pin-input-hidden-input";
import {
	PinInputInput as Input,
	type PinInputInputCommonProps,
	type PinInputInputOptions,
	type PinInputInputProps,
	type PinInputInputRenderProps,
} from "./pin-input-input";
import {
	PinInputLabel as Label,
	type PinInputLabelCommonProps,
	type PinInputLabelOptions,
	type PinInputLabelProps,
	type PinInputLabelRenderProps,
} from "./pin-input-label";
import {
	type PinInputRootCommonProps,
	type PinInputRootOptions,
	type PinInputRootProps,
	type PinInputRootRenderProps,
	PinInputRoot as Root,
} from "./pin-input-root";

export type {
	PinInputControlCommonProps,
	PinInputControlOptions,
	PinInputControlProps,
	PinInputControlRenderProps,
	PinInputDescriptionOptions,
	PinInputDescriptionCommonProps,
	PinInputDescriptionRenderProps,
	PinInputDescriptionProps,
	PinInputErrorMessageOptions,
	PinInputErrorMessageCommonProps,
	PinInputErrorMessageRenderProps,
	PinInputErrorMessageProps,
	PinInputHiddenInputProps,
	PinInputInputOptions,
	PinInputInputCommonProps,
	PinInputInputRenderProps,
	PinInputInputProps,
	PinInputLabelOptions,
	PinInputLabelCommonProps,
	PinInputLabelRenderProps,
	PinInputLabelProps,
	PinInputRootOptions,
	PinInputRootCommonProps,
	PinInputRootRenderProps,
	PinInputRootProps,
};

export { Description, ErrorMessage, Control, HiddenInput, Input, Label, Root };

export const PinInput = Object.assign(Root, {
	Description,
	ErrorMessage,
	Control,
	HiddenInput,
	Input,
	Label,
});
