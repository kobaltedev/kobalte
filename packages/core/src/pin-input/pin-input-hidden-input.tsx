import { visuallyHiddenStyles } from "@kobalte/utils";
import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { usePinInputContext } from "./pin-input-root-provider";

export type PinInputHiddenInputCommonProps<
	T extends HTMLElement = HTMLElement,
> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type PinInputHiddenInputRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<PinInputHiddenInputCommonProps<ElementOf<T>>>;

export function PinInputHiddenInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, PinInputHiddenInputRootProps<T>>,
) {
	const context = usePinInputContext();

	return (
		<Polymorphic
			as="input"
			type="text"
			id={context.hiddenInputId}
			ref={(el: HTMLInputElement) => (context.hiddenInputRef = el)}
			style={{ ...visuallyHiddenStyles }}
			maxLength={context.values().length}
			value={context.valuesAsString()}
			disabled={context.disabled}
			readonly={context.readOnly}
			data-disabled={context.disabled}
			{...props}
		>
			{props.children}
		</Polymorphic>
	);
}
