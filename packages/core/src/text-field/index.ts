import {
  FormControlDescription as Description,
  type FormControlDescriptionProps as TextFieldDescriptionProps,
  FormControlErrorMessage as ErrorMessage,
  type FormControlErrorMessageOptions as TextFieldErrorMessageOptions,
  type FormControlErrorMessageProps as TextFieldErrorMessageProps,
  FormControlLabel as Label,
  type FormControlLabelProps as TextFieldLabelProps,
} from "../form-control";
import { TextFieldInput as Input, type TextFieldInputProps } from "./text-field-input";
import {
  TextFieldRoot as Root,
  type TextFieldRootOptions,
  type TextFieldRootProps,
} from "./text-field-root";
import {
  TextFieldTextArea as TextArea,
  type TextFieldTextAreaOptions,
  type TextFieldTextAreaProps,
} from "./text-field-text-area";

export type {
  TextFieldDescriptionProps,
  TextFieldErrorMessageOptions,
  TextFieldErrorMessageProps,
  TextFieldInputProps,
  TextFieldLabelProps,
  TextFieldRootOptions,
  TextFieldRootProps,
  TextFieldTextAreaOptions,
  TextFieldTextAreaProps,
};
export { Description, ErrorMessage, Input, Label, Root, TextArea };
