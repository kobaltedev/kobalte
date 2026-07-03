import type { ValidComponent } from "@solidjs/web";
import {
	FormControlDescription,
	type FormControlDescriptionCommonProps,
	type FormControlDescriptionOptions,
	type FormControlDescriptionProps,
	type FormControlDescriptionRenderProps,
} from "../form-control";
import type { PolymorphicProps } from "../polymorphic";

export type {
	FormControlDescriptionCommonProps as OTPFieldDescriptionCommonProps,
	FormControlDescriptionOptions as OTPFieldDescriptionOptions,
	FormControlDescriptionRenderProps as OTPFieldDescriptionRenderProps,
};

export type OTPFieldDescriptionProps = FormControlDescriptionProps;

export function OTPFieldDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, OTPFieldDescriptionProps>,
) {
	return <FormControlDescription<T> {...(props as any)} />;
}
