import { createPresence } from "@solid-primitives/presence";
import type { ValidComponent } from "@solidjs/web";
import { createSignal, merge, omit, type Ref, Show } from "solid-js";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control/index.ts";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import {
	type CheckboxDataSet,
	useCheckboxContext,
} from "./checkbox-context.tsx";

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
	ref: Ref<T>;
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

	const [_ref, setRef] = createSignal<HTMLElement>();

	const mergedProps = merge(
		{
			id: context.generateId("indicator"),
		},
		props as CheckboxIndicatorProps,
	);

	const others = omit(mergedProps, "ref", "forceMount");

	const { isMounted: present } = createPresence(
		() =>
			mergedProps.forceMount ||
			context.indeterminate() ||
			context.checked() ||
			undefined,
		{ transitionDuration: 0 },
	);

	return (
		<Show when={present()}>
			<Polymorphic<CheckboxIndicatorRenderProps>
				as="div"
				ref={[setRef, mergedProps.ref]}
				{...formControlContext.dataset()}
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
