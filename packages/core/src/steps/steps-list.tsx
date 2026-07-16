import type { Orientation } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useStepsContext } from "./steps-context";

export interface StepsListOptions {}

export interface StepsListCommonProps<T extends HTMLElement = HTMLElement> {}

export interface StepsListRenderProps extends StepsListCommonProps {
	"data-orientation": Orientation;
}

export type StepsListProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsListOptions & Partial<StepsListCommonProps<ElementOf<T>>>;

/**
 * Contains the steps' items.
 */
export function StepsList<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepsListProps<T>>,
) {
	const context = useStepsContext();

	return (
		<Polymorphic<StepsListRenderProps>
			as="div"
			data-orientation={context.orientation()}
			{...(props as StepsListProps)}
		/>
	);
}
