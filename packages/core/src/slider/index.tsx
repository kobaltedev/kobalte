import {
  FormControlDescription as Description,
  type FormControlDescriptionProps as SliderDescriptionProps,
  FormControlErrorMessage as ErrorMessage,
  type FormControlErrorMessageOptions as SliderErrorMessageOptions,
  type FormControlErrorMessageProps as SliderErrorMessageProps,
  FormControlLabel as Label,
  type FormControlLabelProps as SliderLabelProps,
} from "../form-control";
import { SliderFill as Fill, type SliderFillOptions, type SliderFillProps } from "./slider-fill";
import { SliderInput as Input, type SliderInputProps } from "./slider-input";
import {
  type GetValueLabelParams as SliderGetValueLabelParams,
  SliderRoot as Root,
  type SliderRootOptions,
  type SliderRootProps,
} from "./slider-root";
import { SliderThumb as Thumb, type SliderThumbProps } from "./slider-thumb";
import { SliderTrack as Track, type SliderTrackProps } from "./slider-track";
import { SliderValueLabel as ValueLabel, type SliderValueLabelProps } from "./slider-value-label";

export type {
  SliderDescriptionProps,
  SliderErrorMessageOptions,
  SliderErrorMessageProps,
  SliderFillOptions,
  SliderFillProps,
  SliderGetValueLabelParams,
  SliderInputProps,
  SliderLabelProps,
  SliderRootOptions,
  SliderRootProps,
  SliderThumbProps,
  SliderTrackProps,
  SliderValueLabelProps,
};
export { Description, ErrorMessage, Fill, Input, Label, Root, Thumb, Track, ValueLabel };
