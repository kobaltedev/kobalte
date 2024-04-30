import {
	OverrideComponentProps,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { Show, ValidComponent, splitProps } from "solid-js";

import { FormControlDataSet, useFormControlContext } from "../form-control";
import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { createPresence } from "../primitives";
import { CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxIndicatorOptions {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface CheckboxIndicatorCommonProps {
	id: string;
	ref: HTMLElement | ((el: HTMLElement) => void);
}

export interface CheckboxIndicatorRenderProps
	extends CheckboxIndicatorCommonProps,
		FormControlDataSet,
		CheckboxDataSet {}

export type CheckboxIndicatorProps = CheckboxIndicatorOptions &
	Partial<CheckboxIndicatorCommonProps>;

/**
 * The visual indicator rendered when the checkbox is in a checked or indeterminate state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function CheckboxIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxIndicatorProps>,
) {
	const formControlContext = useFormControlContext();
	const context = useCheckboxContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("indicator"),
		},
		props as CheckboxIndicatorProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "forceMount"]);

	const presence = createPresence(
		() => local.forceMount || context.indeterminate() || context.checked(),
	);

	return (
		<Show when={presence.isPresent()}>
			<Polymorphic<CheckboxIndicatorRenderProps>
				as="div"
				ref={mergeRefs(presence.setRef, local.ref)}
				{...formControlContext.dataset()}
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
