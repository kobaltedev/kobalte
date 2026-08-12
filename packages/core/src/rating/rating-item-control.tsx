import { isFunction } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { children, merge, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import {
	type RatingItemState,
	useRatingItemContext,
} from "./rating-item-context.tsx";

export interface RatingItemControlOptions {
	/**
	 * The children of the rating item.
	 * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
	 */
	children?: JSX.Element | ((state: RatingItemState) => JSX.Element);
}

export interface RatingItemControlCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface RatingItemControlRenderProps
	extends RatingItemControlCommonProps {
	role: "presentation";
	children: JSX.Element;
}

export type RatingItemControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingItemControlOptions &
	Partial<RatingItemControlCommonProps<ElementOf<T>>>;

export function RatingItemControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingItemControlProps<T>>,
) {
	const context = useRatingItemContext();

	const defaultId = `${context.generateId("control")}`;

	const mergedProps = merge(
		{
			id: defaultId,
		},
		props as RatingItemControlProps,
	);

	const others = omit(mergedProps, "children");

	return (
		<Polymorphic<RatingItemControlRenderProps>
			as="div"
			role="presentation"
			{...others}
		>
			<RatingItemControlChild
				state={{
					highlighted: context.state.highlighted,
					half: context.state.half,
				}}
			>
				{mergedProps.children}
			</RatingItemControlChild>
		</Polymorphic>
	);
}

interface RatingItemControlChildProps
	extends Pick<RatingItemControlProps, "children"> {
	state: RatingItemState;
}

function RatingItemControlChild(props: RatingItemControlChildProps) {
	const resolvedChildren = children(() => {
		const body = props.children;
		return isFunction(body) ? body(props.state) : body;
	});

	return <>{resolvedChildren()}</>;
}
