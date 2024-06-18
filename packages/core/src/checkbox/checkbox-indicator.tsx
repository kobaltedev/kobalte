import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	Show,
	type ValidComponent,
	createEffect,
	createSignal,
	splitProps,
} from "solid-js";

import createPresence from "solid-presence";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxIndicatorOptions {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface CheckboxIndicatorCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface CheckboxIndicatorRenderProps
	extends CheckboxIndicatorCommonProps,
		FormControlDataSet,
		CheckboxDataSet {}

export type CheckboxIndicatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxIndicatorOptions &
	Partial<CheckboxIndicatorCommonProps<ElementOf<T>>>;

/**
 * The visual indicator rendered when the checkbox is in a checked or indeterminate state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function CheckboxIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxIndicatorProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useCheckboxContext();

	const [ref, setRef] = createSignal<HTMLElement>();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("indicator"),
		},
		props as CheckboxIndicatorProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "forceMount"]);

	const { present } = createPresence({
		show: () =>
			local.forceMount || context.indeterminate() || context.checked(),
		element: () => ref() ?? null,
	});

	return (
		<Show when={present()}>
			<Polymorphic<CheckboxIndicatorRenderProps>
				as="div"
				ref={mergeRefs(setRef, local.ref)}
				{...formControlContext.dataset()}
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
