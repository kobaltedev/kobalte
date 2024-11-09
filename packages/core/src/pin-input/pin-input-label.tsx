import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { usePinInputContext } from "./pin-input-root-provider";

export type PinInputLabelCommonProps<T extends HTMLElement = HTMLElement> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type PinInputLabelRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<PinInputLabelCommonProps<ElementOf<T>>>;

export function PinInputLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, PinInputLabelRootProps<T>>,
) {
	const context = usePinInputContext();

	return (
		<Polymorphic
			as="label"
			htmlFor={context.hiddenInputId}
			data-disabled={context.disabled}
			data-readonly={context.readOnly}
			onClick={(event: MouseEvent) => {
				event.preventDefault();
				context.inputElements()?.[0].focus({ preventScroll: true });
			}}
			{...props}
		>
			{props.children}
		</Polymorphic>
	);
}
