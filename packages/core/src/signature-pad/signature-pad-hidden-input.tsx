import { visuallyHiddenStyles } from "@kobalte/utils";
import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useSignaturePadContext } from "./signature-pad-provider";

export type SignaturePadHiddenInputCommonProps<
	T extends HTMLElement = HTMLElement,
> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type SignaturePadHiddenInputRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<SignaturePadHiddenInputCommonProps<ElementOf<T>>>;

export function SignaturePadHiddenInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, SignaturePadHiddenInputRootProps<T>>,
) {
	const context = useSignaturePadContext();

	return (
		<Polymorphic
			as="input"
			type="text"
			id={context.controlId}
			style={{ ...visuallyHiddenStyles }}
			disabled={context.disabled}
			{...props}
		>
			{props.children}
		</Polymorphic>
	);
}
