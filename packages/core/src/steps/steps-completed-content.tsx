import type { ValidComponent } from "@solidjs/web";
import { omit, Show } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useStepsContext } from "./steps-context";

export interface StepsCompletedContentOptions {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface StepsCompletedContentCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
}

export interface StepsCompletedContentRenderProps
	extends StepsCompletedContentCommonProps {}

export type StepsCompletedContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsCompletedContentOptions &
	Partial<StepsCompletedContentCommonProps<ElementOf<T>>>;

/**
 * The content shown once every step has been completed
 * (`context.value() >= context.count()`).
 */
export function StepsCompletedContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepsCompletedContentProps<T>>,
) {
	const context = useStepsContext();

	const others = omit(props as StepsCompletedContentProps, "ref", "forceMount");

	return (
		<Show
			when={
				(props as StepsCompletedContentProps).forceMount ||
				context.isCompleted()
			}
		>
			<Polymorphic<StepsCompletedContentRenderProps>
				as="div"
				ref={
					(props as StepsCompletedContentProps).ref as (
						el: HTMLElement,
					) => void
				}
				{...others}
			/>
		</Show>
	);
}
