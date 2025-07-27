import { mergeDefaultProps, visuallyHiddenStyles } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type JSX,
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type RatingItemDataSet,
	useRatingItemContext,
} from "./rating-item-context";

export interface RatingItemLabelOptions {}

export interface RatingItemLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	style: JSX.CSSProperties | string;
}

export interface RatingItemLabelRenderProps
	extends RatingItemLabelCommonProps,
		RatingItemDataSet {
	for: string | undefined;
}

export type RatingItemLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingItemLabelOptions & Partial<RatingItemLabelCommonProps<ElementOf<T>>>;

export function RatingItemLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, RatingItemLabelProps<T>>,
) {
	const context = useRatingItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as RatingItemLabelProps,
	);

	const [local, others] = splitProps(mergedProps, ["style"]);

	createEffect(() => onCleanup(context.registerLabel(others.id!)));

	return (
		<Polymorphic<RatingItemLabelRenderProps>
			as="label"
			for={context.itemId()}
			style={combineStyle(visuallyHiddenStyles, local.style)}
			{...context.dataset()}
			{...others}
		/>
	);
}
