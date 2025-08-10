import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useSignaturePadContext } from "./signature-pad-provider";

export type SignaturePadLabelCommonProps<T extends HTMLElement = HTMLElement> =
	{
		id?: string;
		style?: JSX.CSSProperties | string;
	};

export type SignaturePadLabelRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<SignaturePadLabelCommonProps<ElementOf<T>>>;

export function SignaturePadLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, SignaturePadLabelRootProps<T>>,
) {
	const context = useSignaturePadContext();

	return (
		<Polymorphic
			as="label"
			htmlFor={context.controlId}
			data-disabled={context.disabled}
			onClick={(event: MouseEvent) => {
				if (!context.disabled) {
					return;
				}
				if (event.defaultPrevented) {
					return;
				}
				context.signaturePadRef?.focus({ preventScroll: true });
			}}
			{...props}
		>
			{props.children}
		</Polymorphic>
	);
}
