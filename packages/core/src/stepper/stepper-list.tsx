import { type ValidComponent, splitProps, JSX } from "solid-js";
import { Tabs } from "../tabs";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";

export interface StepperListOptions {}

export interface StepperListCommonProps<T extends HTMLElement = HTMLElement> {
	children?: JSX.Element;
}

export type StepperListProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	StepperListOptions & Partial<StepperListCommonProps<ElementOf<T>>>;

export function StepperList<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepperListProps<T>>
) {
	const [local, others] = splitProps(props as StepperListProps, ["children"]);

	return (
		<Tabs.List {...others}>
			{local.children}
		</Tabs.List>
	);
}
