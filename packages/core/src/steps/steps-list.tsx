import type { Orientation } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { type Component } from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { Tabs, type TabsListRenderProps } from "../tabs";

export interface StepsListOptions {}

export interface StepsListCommonProps<T extends HTMLElement = HTMLElement> {}

export interface StepsListRenderProps extends StepsListCommonProps {
	"data-orientation": Orientation;
}

export type StepsListProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsListOptions & Partial<StepsListCommonProps<ElementOf<T>>>;

/**
 * Contains the steps' items. Wraps `Tabs.List` internally — this is what
 * gives roving-tabindex arrow-key navigation (and Home/End) between step
 * triggers, `role="tablist"`, and `aria-orientation` for free.
 */
export function StepsList<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepsListProps<T>>,
) {
	return (
		<Tabs.List<Component<Omit<StepsListRenderProps, keyof TabsListRenderProps>>>
			{...(props as StepsListProps)}
		/>
	);
}
