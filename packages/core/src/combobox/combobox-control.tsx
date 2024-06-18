import { OverrideComponentProps, isFunction, mergeRefs } from "@kobalte/utils";
import {
	type Accessor,
	type JSX,
	type ValidComponent,
	children,
	splitProps,
} from "solid-js";

import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type ComboboxDataSet, useComboboxContext } from "./combobox-context";

export interface ComboboxControlState<Option> {
	/** The selected options. */
	selectedOptions: Accessor<Option[]>;

	/** A function to remove an option from the selection. */
	remove: (option: Option) => void;

	/** A function to clear the selection. */
	clear: () => void;
}

export interface ComboboxControlOptions<Option> {
	/**
	 * The children of the combobox control.
	 * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
	 */
	children?:
		| JSX.Element
		| ((state: ComboboxControlState<Option>) => JSX.Element);
}

export interface ComboboxControlCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
}

export interface ComboboxControlRenderProps
	extends ComboboxControlCommonProps,
		FormControlDataSet,
		ComboboxDataSet {
	children: JSX.Element;
}

export type ComboboxControlProps<
	Option,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ComboboxControlOptions<Option> &
	Partial<ComboboxControlCommonProps<ElementOf<T>>>;

/**
 * Contains the combobox input and trigger.
 */
export function ComboboxControl<Option, T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ComboboxControlProps<Option, T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useComboboxContext();

	const [local, others] = splitProps(props as ComboboxControlProps<Option>, [
		"ref",
		"children",
	]);

	const selectionManager = () => context.listState().selectionManager();

	return (
		<Polymorphic<ComboboxControlRenderProps>
			as="div"
			ref={mergeRefs(context.setControlRef, local.ref)}
			{...context.dataset()}
			{...formControlContext.dataset()}
			{...others}
		>
			<ComboboxControlChild
				state={{
					selectedOptions: () => context.selectedOptions(),
					remove: (option) => context.removeOptionFromSelection(option),
					clear: () => selectionManager().clearSelection(),
				}}
			>
				{local.children}
			</ComboboxControlChild>
		</Polymorphic>
	);
}

interface ComboboxControlChildProps<Option>
	extends Pick<ComboboxControlOptions<Option>, "children"> {
	state: ComboboxControlState<Option>;
}

function ComboboxControlChild<Option>(
	props: ComboboxControlChildProps<Option>,
) {
	const resolvedChildren = children(() => {
		const body = props.children;
		return isFunction(body) ? body(props.state) : body;
	});

	return <>{resolvedChildren()}</>;
}
