import { OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useToastTime } from "./use-toast-time";

export interface ToastProgressFillOptions extends AsChildProp {
	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
}

export interface ToastProgressFillProps
	extends OverrideComponentProps<"div", ToastProgressFillOptions> {}

/**
 * The component that visually represents the toast remaining lifetime.
 * Used to visually show the fill of `Toast.ProgressTrack`.
 */
export function ToastProgressFill(props: ToastProgressFillProps) {
	const [local, others] = splitProps(props, ["style"]);

	const { remainingFraction } = useToastTime();
	const lifeTime = () => Math.trunc(remainingFraction() * 100);

	return (
		<Polymorphic
			as="div"
			style={{
				"--kb-toast-progress-fill-width": `${lifeTime()}%`,
				...local.style,
			}}
			{...others}
		/>
	);
}
