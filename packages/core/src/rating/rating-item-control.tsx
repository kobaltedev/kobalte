import { callHandler, isFunction, mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent, children, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type RatingItemState,
	useRatingItemContext,
} from "./rating-item-context";

export interface RatingItemControlOptions {
	/**
	 * The children of the rating group item.
	 * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
	 */
	children?: JSX.Element | ((state: RatingItemState) => JSX.Element);
}

export interface RatingItemControlCommonProps<
	T extends HTMLElement = HTMLElement,
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

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as RatingItemControlProps,
	);

	const [local, others] = splitProps(mergedProps, ["children"]);

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
				{local.children}
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
