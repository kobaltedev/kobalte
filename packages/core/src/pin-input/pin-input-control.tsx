import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "solid-js";
import { useFormControlContext } from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface PinInputControlOptions {}

export interface PinInputControlCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface PinInputControlRenderProps extends PinInputControlCommonProps {
	role: "presentation";
}

export type PinInputControlProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PinInputControlOptions & Partial<PinInputControlCommonProps<ElementOf<T>>>;

export function PinInputControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PinInputControlProps<T>>,
) {
	const formControlContext = useFormControlContext();

	const defaultId = `${formControlContext.generateId("control")}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as PinInputControlProps,
	);

	return (
		<Polymorphic<PinInputControlRenderProps>
			as="div"
			role="presentation"
			{...mergedProps}
		/>
	);
}
