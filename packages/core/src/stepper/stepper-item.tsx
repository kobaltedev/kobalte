import { type ValidComponent, splitProps, JSX } from "solid-js";
import { Tabs } from "../tabs";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";
import { useStepperContext } from "./stepper-context";

export interface StepperItemOptions {
	/** The index of this step */
	index: number;
}

export interface StepperItemCommonProps<T extends HTMLElement = HTMLElement> {
	children?: JSX.Element;
}

export interface StepperItemRenderProps extends StepperItemCommonProps {}

export type StepperItemProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	StepperItemOptions & Partial<StepperItemCommonProps<ElementOf<T>>>;

export function StepperItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepperItemProps<T>>
) {
	const context = useStepperContext();
	const [local, others] = splitProps(props as StepperItemProps, ["index", "children"]);

	const isCurrent = () => context.step() === local.index;
	const isComplete = () => context.step() > local.index;

	return (
		<Tabs.Trigger
			value={local.index.toString()}
			disabled={context.isDisabled()}
			aria-current={isCurrent() ? "step" : undefined}
			data-current={isCurrent() ? "" : undefined}
			data-complete={isComplete() ? "" : undefined}
			{...others}
		>
			{local.children}
		</Tabs.Trigger>
	);
}
