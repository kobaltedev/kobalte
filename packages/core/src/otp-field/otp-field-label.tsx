import type { ValidComponent } from "@solidjs/web";
import {
	FormControlLabel,
	type FormControlLabelCommonProps,
	type FormControlLabelOptions,
	type FormControlLabelProps,
	type FormControlLabelRenderProps,
} from "../form-control";
import type { PolymorphicProps } from "../polymorphic";

export type {
	FormControlLabelCommonProps as OTPFieldLabelCommonProps,
	FormControlLabelOptions as OTPFieldLabelOptions,
	FormControlLabelRenderProps as OTPFieldLabelRenderProps,
};

export type OTPFieldLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FormControlLabelProps<T>;

export function OTPFieldLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, OTPFieldLabelProps<T>>,
) {
	return <FormControlLabel<T> {...(props as any)} />;
}
