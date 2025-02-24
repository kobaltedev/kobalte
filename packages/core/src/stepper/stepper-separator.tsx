import { type ValidComponent, splitProps, JSX } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";

export interface StepperSeparatorOptions { }

export interface StepperSeparatorCommonProps<T extends HTMLElement = HTMLElement> {
	children?: JSX.Element;
}

export interface StepperSeparatorRenderProps extends StepperSeparatorCommonProps {
	role: string;
}

export type StepperSeparatorProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	StepperSeparatorOptions & Partial<StepperSeparatorCommonProps<ElementOf<T>>>;

export function StepperSeparator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepperSeparatorProps<T>>
) {
	const [local, others] = splitProps(props as StepperSeparatorProps, ["children"]);

	return (
		<Polymorphic<StepperSeparatorRenderProps>
			as="div"
			role="presentation"
			{...others}
		>
			{local.children}
		</Polymorphic>
	);
}
