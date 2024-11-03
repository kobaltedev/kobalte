import { type ValidComponent, type JSX, splitProps } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";

export interface LabelOptions {
	label?: string;
	children?: JSX.Element;
}

export interface LabelCommonProps<T extends HTMLElement = HTMLElement> {
	id?: string;
	style?: JSX.CSSProperties | string;
}

export type LabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = LabelOptions & Partial<LabelCommonProps<ElementOf<T>>>;

export function Label<T extends ValidComponent = "span">(props: PolymorphicProps<T, LabelProps<T>>) {
	const [local, others] = splitProps(props, ["label", "children"]);

	return <Polymorphic as="span" class="chip__label" {...others}>{local.label || local.children}</Polymorphic>
}
