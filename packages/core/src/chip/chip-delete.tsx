import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";

import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useChipContext } from "./chip-context";

export interface ChipDeleteOptions extends Button.ButtonRootOptions {}

export interface ChipDeleteCommonProps<T extends HTMLElement = HTMLElement>
	extends Button.ButtonRootCommonProps<T> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	"aria-label": string;
}

export interface ChipDeleteRenderProps
	extends ChipDeleteCommonProps,
		Button.ButtonRootRenderProps {}

export type ChipDeleteProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ChipDeleteOptions & Partial<ChipDeleteCommonProps<ElementOf<T>>>;

/**
 * The button that removes the chip.
 * Stops the triggering click/keyboard event from propagating to `Chip.Root`.
 */
export function ChipDelete<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, ChipDeleteProps<T>>,
) {
	const context = useChipContext();

	const p = props as ChipDeleteProps;
	const others = omit(p, "aria-label", "onClick", "disabled");

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		e.stopPropagation();
		callHandler(e, p.onClick);
	};

	return (
		<Button.Root<
			Component<Omit<ChipDeleteRenderProps, keyof Button.ButtonRootRenderProps>>
		>
			aria-label={p["aria-label"] || context.translations().remove}
			disabled={p.disabled ?? context.disabled()}
			onClick={onClick}
			{...others}
		/>
	);
}
