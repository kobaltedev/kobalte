import { type ValidComponent, splitProps, JSX } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";

export interface StepperListOptions { }

export interface StepperListCommonProps<T extends HTMLElement = HTMLElement> {
	children?: JSX.Element;
}

export interface StepperListRenderProps extends StepperListCommonProps { }

export type StepperListProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	StepperListOptions & Partial<StepperListCommonProps<ElementOf<T>>>;

export function StepperList<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepperListProps<T>>
) {
	const [local, others] = splitProps(props as StepperListProps, ["children"]);

	return (
		<Polymorphic<StepperListRenderProps>
			as="div"
			{...others}
		>
			{local.children}
		</Polymorphic>
	);
}
