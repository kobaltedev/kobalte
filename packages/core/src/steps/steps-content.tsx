import type { ValidComponent } from "@solidjs/web";
import { omit, Show } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useStepsContext } from "./steps-context";

export interface StepsContentOptions {
	/** The index of the step this content belongs to. */
	index: number;

	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface StepsContentCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface StepsContentRenderProps extends StepsContentCommonProps {
	"data-current": "" | undefined;
	"aria-labelledby": string;
}

export type StepsContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsContentOptions & Partial<StepsContentCommonProps<ElementOf<T>>>;

/**
 * The content shown while its associated step is the current one.
 */
export function StepsContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepsContentProps<T>>,
) {
	const context = useStepsContext();

	const others = omit(
		props as StepsContentProps,
		"id",
		"ref",
		"index",
		"forceMount",
	);

	const index = () => (props as StepsContentProps).index;
	const isCurrent = () => context.value() === index();

	const id = () =>
		(props as StepsContentProps).id ?? context.generateId(`content-${index()}`);

	// A plain synchronous swap — unlike `Tabs.Content`, there's no reason to
	// animate this transition asynchronously, and doing so via
	// `createPresence` (even with `transitionDuration: 0`) leaves a one-tick
	// window where the outgoing and incoming step's content are both mounted
	// at once (its exit path always goes through a real, if 0ms, setTimeout),
	// which visibly flickers when switching steps.
	return (
		<Show when={(props as StepsContentProps).forceMount || isCurrent()}>
			<Polymorphic<StepsContentRenderProps>
				as="div"
				id={id()}
				ref={(props as StepsContentProps).ref as (el: HTMLElement) => void}
				data-current={isCurrent() ? "" : undefined}
				aria-labelledby={context.generateId(`trigger-${index()}`)}
				{...others}
			/>
		</Show>
	);
}
