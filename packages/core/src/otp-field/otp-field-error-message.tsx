import type { ValidComponent } from "@solidjs/web";
import {
	FormControlErrorMessage,
	type FormControlErrorMessageCommonProps,
	type FormControlErrorMessageOptions,
	type FormControlErrorMessageProps,
	type FormControlErrorMessageRenderProps,
} from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

export type {
	FormControlErrorMessageCommonProps as OTPFieldErrorMessageCommonProps,
	FormControlErrorMessageOptions as OTPFieldErrorMessageOptions,
	FormControlErrorMessageRenderProps as OTPFieldErrorMessageRenderProps,
};

export type OTPFieldErrorMessageProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FormControlErrorMessageProps<ElementOf<T>>;

export function OTPFieldErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, OTPFieldErrorMessageProps<T>>,
) {
	return <FormControlErrorMessage<T> {...(props as any)} />;
}
