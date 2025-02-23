import { callHandler, mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent, splitProps } from "solid-js";
import { useFormControlContext } from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useRatingGroupContext } from "./rating-group-context";

export interface RatingGroupControlOptions {}

export interface RatingGroupControlCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface RatingGroupControlRenderProps
	extends RatingGroupControlCommonProps {
	role: "presentation";
}

export type RatingGroupControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingGroupControlOptions &
	Partial<RatingGroupControlCommonProps<ElementOf<T>>>;

export function RatingGroupControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingGroupControlProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useRatingGroupContext();

	const defaultId = `${formControlContext.generateId("control")}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as RatingGroupControlProps,
	);

	const [local, others] = splitProps(mergedProps, ["onPointerLeave"]);

	const onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		if (formControlContext.isDisabled() || formControlContext.isReadOnly())
			return;

		callHandler(e, local.onPointerLeave);

		if (e.pointerType === "touch") {
			return;
		}

		context.setHoveredValue(-1);
	};

	return (
		<Polymorphic<RatingGroupControlRenderProps>
			as="div"
			role="presentation"
			onPointerLeave={onPointerLeave}
			{...others}
		/>
	);
}
