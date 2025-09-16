import { type ValidComponent, Show, splitProps, JSX } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useStepperContext } from "./stepper-context";

export interface StepperCompletedContentOptions { }

export interface StepperCompletedContentCommonProps<T extends HTMLElement = HTMLElement> {
	children?: JSX.Element;
}

export interface StepperCompletedContentRenderProps extends StepperCompletedContentCommonProps {
	role: string;
	"data-completed"?: string;
}

export type StepperCompletedContentProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	StepperCompletedContentOptions & Partial<StepperCompletedContentCommonProps<ElementOf<T>>>;

export function StepperCompletedContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepperCompletedContentProps<T>>
) {
	const context = useStepperContext();
	const [local, others] = splitProps(props as StepperCompletedContentProps, ["children"]);

	return (
		<Show when={context.isCompleted()}>
			<Polymorphic<StepperCompletedContentRenderProps>
				as="div"
				role="alert"
				data-completed=""
				{...others}
			>
				{local.children}
			</Polymorphic>
		</Show>
	);
}
