import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";

import { useFormControlContext } from "../form-control";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSwitchContext } from "./switch-context";

export interface SwitchThumbProps
	extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The thumb that is used to visually indicate whether the switch is on or off.
 */
export function SwitchThumb(props: SwitchThumbProps) {
	const formControlContext = useFormControlContext();
	const context = useSwitchContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("thumb"),
		},
		props,
	);

	return (
		<Polymorphic
			as="div"
			{...formControlContext.dataset()}
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
