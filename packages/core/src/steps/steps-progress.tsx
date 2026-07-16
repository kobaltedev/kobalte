import type { JSX, ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useStepsContext } from "./steps-context";

export interface StepsProgressOptions {}

export interface StepsProgressCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	style: JSX.CSSProperties | string;
}

export interface StepsProgressRenderProps extends StepsProgressCommonProps {
	role: "progressbar";
	"aria-valuenow": number;
	"aria-valuemin": 0;
	"aria-valuemax": number;
	"data-complete": "" | undefined;
}

export type StepsProgressProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsProgressOptions & Partial<StepsProgressCommonProps<ElementOf<T>>>;

/**
 * A progress bar reflecting how many steps have been completed. Renders as
 * the fill itself (sized via `width`); wrap it in your own track element.
 */
export function StepsProgress<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepsProgressProps<T>>,
) {
	const context = useStepsContext();

	const others = omit(props as StepsProgressProps, "style");

	const resolvedStyle = (): JSX.CSSProperties => {
		const percentStyle = { width: `${context.percent()}%` } as JSX.CSSProperties;
		const userStyle = (props as StepsProgressProps).style;

		if (!userStyle || typeof userStyle === "string") {
			return percentStyle;
		}

		return { ...percentStyle, ...userStyle };
	};

	return (
		<Polymorphic<StepsProgressRenderProps>
			as="div"
			role="progressbar"
			aria-valuenow={context.value()}
			aria-valuemin={0}
			aria-valuemax={context.count()}
			data-complete={context.isCompleted() ? "" : undefined}
			style={resolvedStyle()}
			{...others}
		/>
	);
}
