import { For, type JSX, Show, type ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useSignaturePadContext } from "./signature-pad-provider";

export type SignaturePadSegmentCommonProps<T extends SVGElement = SVGElement> =
	{
		id?: string;
		style?: JSX.CSSProperties | string;
	};

export type SignaturePadSegmentRootProps<
	T extends ValidComponent | SVGElement = SVGElement,
> = Partial<SignaturePadSegmentCommonProps<ElementOf<T>>>;

export function SignaturePadSegment<T extends ValidComponent = "svg">(
	props: PolymorphicProps<T, SignaturePadSegmentRootProps<T>>,
) {
	const context = useSignaturePadContext();

	return (
		<Polymorphic
			as="svg"
			data-disabled={context.disabled}
			aria-disabled={context.disabled}
			ref={(el: SVGElement) => {
				context.setSignatureSVG(el);
			}}
			{...props}
		>
			<title>Signature</title>
			<For each={context.allPaths()}>{(path) => <path d={path} />}</For>
			<Show when={context.currentPath()}>
				<path d={context.currentPath()!} />
			</Show>
		</Polymorphic>
	);
}
