import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useSignaturePadContext } from "./signature-pad-provider";

export type SignaturePadGuideCommonProps<T extends HTMLElement = HTMLElement> =
	{
		id?: string;
		style?: JSX.CSSProperties | string;
	};

export type SignaturePadGuideRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<SignaturePadGuideCommonProps<ElementOf<T>>>;

export function SignaturePadGuide<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SignaturePadGuideRootProps<T>>,
) {
	const context = useSignaturePadContext();

	return (
		<Polymorphic as="div" data-disabled={context.disabled} {...props}>
			{props.children}
		</Polymorphic>
	);
}
