import {
	PinInputContext as Context,
	type PinInputContextProps,
} from "./pin-input-context";
import {
	PinInputControl as Control,
	type PinInputControlCommonProps,
	type PinInputControlRootProps,
} from "./pin-input-control";
import {
	PinInputHiddenInput as HiddenInput,
	type PinInputHiddenInputCommonProps,
	type PinInputHiddenInputRootProps,
} from "./pin-input-hidden-input";
import {
	PinInputInput as Input,
	type PinInputInputCommonProps,
	type PinInputInputProps,
	type PinInputInputRootProps,
} from "./pin-input-input";
import {
	PinInputLabel as Label,
	type PinInputLabelCommonProps,
	type PinInputLabelRootProps,
} from "./pin-input-label";
import {
	type PinInputCommonProps,
	type PinInputRootOptions,
	type PinInputRootProps,
	PinInput as Root,
} from "./pin-input-root";

export type {
	PinInputRootOptions,
	PinInputCommonProps,
	PinInputRootProps,
	PinInputLabelCommonProps,
	PinInputLabelRootProps,
	PinInputControlCommonProps,
	PinInputControlRootProps,
	PinInputInputProps,
	PinInputInputCommonProps,
	PinInputInputRootProps,
	PinInputHiddenInputCommonProps,
	PinInputHiddenInputRootProps,
	PinInputContextProps,
};

export { Root, Label, Control, Input, HiddenInput, Context };

export const PinInput = Object.assign(Root, {
	Root,
	Label,
	Control,
	Input,
	HiddenInput,
	Context,
});
