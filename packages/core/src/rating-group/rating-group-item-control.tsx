import { callHandler, isFunction, mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent, children, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type RatingGroupItemState,
	useRatingGroupItemContext,
} from "./rating-group-item-context";

export interface RatingGroupItemControlOptions {
	/**
	 * The children of the rating group item.
	 * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
	 */
	children?: JSX.Element | ((state: RatingGroupItemState) => JSX.Element);
}

export interface RatingGroupItemControlCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface RatingGroupItemControlRenderProps
	extends RatingGroupItemControlCommonProps {
	role: "presentation";
	children: JSX.Element;
}

export type RatingGroupItemControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingGroupItemControlOptions &
	Partial<RatingGroupItemControlCommonProps<ElementOf<T>>>;

export function RatingGroupItemControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingGroupItemControlProps<T>>,
) {
	const context = useRatingGroupItemContext();

	const defaultId = `${context.generateId("control")}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as RatingGroupItemControlProps,
	);

	const [local, others] = splitProps(mergedProps, ["children"]);

	return (
		<Polymorphic<RatingGroupItemControlRenderProps>
			as="div"
			role="presentation"
			{...others}
		>
			<RatingGroupItemControlChild
				state={{
					highlighted: context.state.highlighted,
					half: context.state.half,
				}}
			>
				{local.children}
			</RatingGroupItemControlChild>
		</Polymorphic>
	);
}

interface RatingGroupItemControlChildProps
	extends Pick<RatingGroupItemControlProps, "children"> {
	state: RatingGroupItemState;
}

function RatingGroupItemControlChild(props: RatingGroupItemControlChildProps) {
	const resolvedChildren = children(() => {
		const body = props.children;
		return isFunction(body) ? body(props.state) : body;
	});

	return <>{resolvedChildren()}</>;
}
