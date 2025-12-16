import { createSignal, mergeProps, splitProps, type JSX, type ValidComponent } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { mergeDefaultProps } from "@kobalte/utils";

export interface ChipRootOptions {
	/** Event handler called when the chip is clicked. */
	onClick?: () => void;
	/** Whether to disable the chip or not... */
	disabled?: boolean;
	/** The children of the chip. */
	children?: JSX.Element;
}

export interface ChipCommonProps<T extends HTMLElement = HTMLElement> {
	id?: string;
	style?: JSX.CSSProperties | string;
}

export type ChipRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ChipRootOptions & Partial<ChipCommonProps<ElementOf<T>>>;

export function Chip<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ChipRootProps<T>>,
) {
	// Merging default values
	const mergedProps = mergeDefaultProps(
		{ disabled: false },
		props as ChipRootProps,
	);

	const [local, others] = splitProps(mergedProps, ["disabled", "onClick"]);

	const handleSelect = () => {
		if (!local.disabled) {
			local.onClick?.();
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!local.disabled && (event.key === "Enter" || event.key === " ")) {
			event.preventDefault(); // Prevents scrolling when using the Space key
			handleSelect();
		}
	};

	return (
		<Polymorphic
			as="div"
			class="chip__root"
			role="button"
			tabindex={local.disabled ? -1 : 0}
			aria-disabled={local.disabled}
			onClick={handleSelect}
			onKeyDown={handleKeyDown}
			{...others}
		>
			{props.children}
		</Polymorphic>
	);
}
