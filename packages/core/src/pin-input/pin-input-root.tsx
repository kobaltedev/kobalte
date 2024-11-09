import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

import { PinInputProvider } from "./pin-input-root-provider";

import type { PinInputRootOptions } from "./types";

export type { PinInputRootOptions };

export type PinInputCommonProps<T extends HTMLElement = HTMLElement> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type PinInputRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PinInputRootOptions & Partial<PinInputCommonProps<ElementOf<T>>>;

export function PinInput<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PinInputRootProps<T>>,
) {
	return (
		<PinInputProvider {...props}>
			<Polymorphic as="div" {...props}>
				{props.children}
			</Polymorphic>
		</PinInputProvider>
	);
}
