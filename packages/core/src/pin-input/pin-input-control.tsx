import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { usePinInputContext } from "./pin-input-root-provider";

export type PinInputControlCommonProps<T extends HTMLElement = HTMLElement> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type PinInputControlRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<PinInputControlCommonProps<ElementOf<T>>>;

export function PinInputControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PinInputControlRootProps<T>>,
) {
	const context = usePinInputContext();

	return (
		<Polymorphic as="div" htmlFor={context.hiddenInputId} {...props}>
			{props.children}
		</Polymorphic>
	);
}
