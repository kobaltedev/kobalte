import { type JSX, type ValidComponent, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { SignaturePadProvider } from "./signature-pad-provider";

import type { SignaturePadRootOptions } from "./types";

export interface SignaturePadRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id?: string;
	style?: JSX.CSSProperties | string;
}

export type SignaturePadRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SignaturePadRootOptions &
	Partial<SignaturePadRootCommonProps<ElementOf<T>>>;

export function SignaturePad<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SignaturePadRootProps<T>>,
) {
	return (
		<SignaturePadProvider {...props}>
			<Polymorphic as="div" {...props}>
				{props.children}
			</Polymorphic>
		</SignaturePadProvider>
	);
}
