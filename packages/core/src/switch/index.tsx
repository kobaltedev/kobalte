import {
	SwitchControl as Control,
	type SwitchControlCommonProps,
	type SwitchControlOptions,
	type SwitchControlProps,
	type SwitchControlRenderProps,
} from "./switch-control";
import {
	SwitchDescription as Description,
	type SwitchDescriptionCommonProps,
	type SwitchDescriptionOptions,
	type SwitchDescriptionProps,
	type SwitchDescriptionRenderProps,
} from "./switch-description";
import {
	SwitchErrorMessage as ErrorMessage,
	type SwitchErrorMessageCommonProps,
	type SwitchErrorMessageOptions,
	type SwitchErrorMessageProps,
	type SwitchErrorMessageRenderProps,
} from "./switch-error-message";
import {
	SwitchInput as Input,
	type SwitchInputCommonProps,
	type SwitchInputOptions,
	type SwitchInputProps,
	type SwitchInputRenderProps,
} from "./switch-input";
import {
	SwitchLabel as Label,
	type SwitchLabelCommonProps,
	type SwitchLabelOptions,
	type SwitchLabelProps,
	type SwitchLabelRenderProps,
} from "./switch-label";
import {
	SwitchRoot as Root,
	type SwitchRootCommonProps,
	type SwitchRootOptions,
	type SwitchRootProps,
	type SwitchRootRenderProps,
} from "./switch-root";
import {
	type SwitchThumbCommonProps,
	type SwitchThumbOptions,
	type SwitchThumbProps,
	type SwitchThumbRenderProps,
	SwitchThumb as Thumb,
} from "./switch-thumb";

export type {
	SwitchControlOptions,
	SwitchControlCommonProps,
	SwitchControlRenderProps,
	SwitchControlProps,
	SwitchDescriptionOptions,
	SwitchDescriptionCommonProps,
	SwitchDescriptionRenderProps,
	SwitchDescriptionProps,
	SwitchErrorMessageOptions,
	SwitchErrorMessageCommonProps,
	SwitchErrorMessageRenderProps,
	SwitchErrorMessageProps,
	SwitchInputOptions,
	SwitchInputCommonProps,
	SwitchInputRenderProps,
	SwitchInputProps,
	SwitchLabelOptions,
	SwitchLabelCommonProps,
	SwitchLabelRenderProps,
	SwitchLabelProps,
	SwitchRootOptions,
	SwitchRootCommonProps,
	SwitchRootRenderProps,
	SwitchRootProps,
	SwitchThumbOptions,
	SwitchThumbCommonProps,
	SwitchThumbRenderProps,
	SwitchThumbProps,
};
export { Control, Description, ErrorMessage, Input, Label, Root, Thumb };

export const Switch = Object.assign(Root, {
	Control,
	Description,
	ErrorMessage,
	Input,
	Label,
	Thumb,
});

/**
 * API will most probably change
 */
export { useSwitchContext, type SwitchContextValue } from "./switch-context";
