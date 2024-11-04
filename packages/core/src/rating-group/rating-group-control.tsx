import {
	EventKey,
	callHandler,
	isFunction,
	mergeDefaultProps,
} from "@kobalte/utils";
import {
	Accessor,
	type JSX,
	type ValidComponent,
	children,
	createUniqueId,
	splitProps,
} from "solid-js";

import { useFormControlContext } from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useRatingGroupContext } from "./rating-group-context";
export interface RatingGroupControlState {
	items: number[];
}
export interface RatingGroupControlOptions {
	children?: JSX.Element | ((state: RatingGroupControlState) => JSX.Element);
}

export interface RatingGroupControlCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerEnter: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface RatingGroupControlRenderProps
	extends RatingGroupControlCommonProps {
	children: JSX.Element;
}

export type RatingGroupControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingGroupControlOptions &
	Partial<RatingGroupControlCommonProps<ElementOf<T>>>;

/**
 * The element that visually represents a rating group.
 */
export function RatingGroupControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingGroupControlProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useRatingGroupContext();
	const defaultId = `${formControlContext.generateId(
		"control",
	)}-${createUniqueId()}`;
	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as RatingGroupControlProps,
	);

	const [local, others] = splitProps(mergedProps, ["children"]);

	return (
		<Polymorphic<RatingGroupControlRenderProps>
			as="div"
			onPointerEnter={() => context.setIsInteractive(true)}
			onPointerLeave={() => context.setIsInteractive(false)}
			{...others}
		>
			<RatingGroupControlChild
				state={{
					items: Array.from({ length: context.count }, (_, i) => i + 1),
				}}
			>
				{local.children}
			</RatingGroupControlChild>
		</Polymorphic>
	);
}

interface RatingGroupControlChildProps
	extends Pick<RatingGroupControlOptions, "children"> {
	state: RatingGroupControlState;
}

function RatingGroupControlChild(props: RatingGroupControlChildProps) {
	const resolvedChildren = children(() => {
		const body = props.children;
		return isFunction(body) ? body(props.state) : body;
	});

	return <>{resolvedChildren()}</>;
}
