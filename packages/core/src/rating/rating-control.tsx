import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { useFormControlContext } from "../form-control/index.ts";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useRatingContext } from "./rating-context.tsx";

export interface RatingControlOptions {}

export interface RatingControlCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface RatingControlRenderProps extends RatingControlCommonProps {
	role: "presentation";
}

export type RatingControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingControlOptions & Partial<RatingControlCommonProps<ElementOf<T>>>;

export function RatingControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingControlProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useRatingContext();

	const defaultId = `${formControlContext.generateId("control")}`;

	const mergedProps = merge(
		{
			id: defaultId,
		},
		props as RatingControlProps,
	);

	const others = omit(mergedProps, "onPointerLeave");

	const onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		if (formControlContext.isDisabled() || formControlContext.isReadOnly())
			return;

		callHandler(e, mergedProps.onPointerLeave);

		if (e.pointerType === "touch") {
			return;
		}

		context.setHoveredValue(-1);
	};

	return (
		<Polymorphic<RatingControlRenderProps>
			as="div"
			role="presentation"
			onPointerLeave={onPointerLeave}
			{...others}
		/>
	);
}
