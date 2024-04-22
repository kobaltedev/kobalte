import { mergeDefaultProps } from "@kobalte/utils";
import { ValidComponent } from "solid-js";

import { FormControlDataSet, useFormControlContext } from "../form-control";
import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { SwitchDataSet, useSwitchContext } from "./switch-context";

export interface SwitchThumbOptions {}

export interface SwitchThumbCommonProps {
	id: string;
}

export interface SwitchThumbRenderProps
	extends SwitchThumbCommonProps,
		FormControlDataSet,
		SwitchDataSet {}

export type SwitchThumbProps = SwitchThumbOptions &
	Partial<SwitchThumbCommonProps>;

/**
 * The thumb that is used to visually indicate whether the switch is on or off.
 */
export function SwitchThumb<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SwitchThumbProps>,
) {
	const formControlContext = useFormControlContext();
	const context = useSwitchContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("thumb"),
		},
		props as SwitchThumbProps,
	);

	return (
		<Polymorphic<SwitchThumbRenderProps>
			as="div"
			{...formControlContext.dataset()}
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
