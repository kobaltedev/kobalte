import { type ValidComponent, splitProps, JSX } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useStepperContext } from "./stepper-context";

export interface StepperItemOptions {
	/** The index of this step item */
	index: number;
}

export interface StepperItemCommonProps<T extends HTMLElement = HTMLElement> {
	children?: JSX.Element;
}

export interface StepperItemRenderProps extends StepperItemCommonProps {
	"data-complete"?: string;
	"data-current"?: string;
}

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
		<Polymorphic<StepperItemRenderProps>
			as="div"
			aria-selected={isCurrent()}
			data-current={isCurrent() ? "" : undefined}
			data-complete={isComplete() ? "" : undefined}
			{...others}
		>
			{local.children}
		</Polymorphic>
	);
}
