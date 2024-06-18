import {
	OverrideComponentProps,
	isFunction,
	mergeDefaultProps,
} from "@kobalte/utils";
import {
	type Accessor,
	type JSX,
	Show,
	type ValidComponent,
	children,
	createEffect,
	onCleanup,
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
import { useSelectContext } from "./select-context";

export interface SelectValueState<Option> {
	/** The first (or only, in case of single select) selected option. */
	selectedOption: Accessor<Option>;

	/** An array of selected options. It will contain only one value in case of single select. */
	selectedOptions: Accessor<Option[]>;

	/** A function to remove an option from the selection. */
	remove: (option: Option) => void;

	/** A function to clear the selection. */
	clear: () => void;
}

export interface SelectValueOptions<Option> {
	/**
	 * The children of the select value.
	 * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
	 */
	children?: JSX.Element | ((state: SelectValueState<Option>) => JSX.Element);
}

export interface SelectValueCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface SelectValueRenderProps
	extends SelectValueCommonProps,
		FormControlDataSet {
	children: JSX.Element;
	"data-placeholder-shown": string | undefined;
}

export type SelectValueProps<
	Option,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SelectValueOptions<Option> & Partial<SelectValueCommonProps<ElementOf<T>>>;

/**
 * The part that reflects the selected value(s).
 */
export function SelectValue<Option, T extends ValidComponent = "span">(
	props: PolymorphicProps<T, SelectValueProps<Option, T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useSelectContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("value"),
		},
		props as SelectValueProps<Option>,
	);

	const [local, others] = splitProps(mergedProps, ["id", "children"]);

	const selectionManager = () => context.listState().selectionManager();

	const isSelectionEmpty = () => {
		const selectedKeys = selectionManager().selectedKeys();

		// Some form libraries uses an empty string as default value, often taken from an empty `<option />`.
		// Ignore since it is not a valid key.
		if (selectedKeys.size === 1 && selectedKeys.has("")) {
			return true;
		}

		return selectionManager().isEmpty();
	};

	createEffect(() => onCleanup(context.registerValueId(local.id!)));

	return (
		<Polymorphic<SelectValueRenderProps>
			as="span"
			id={local.id}
			data-placeholder-shown={isSelectionEmpty() ? "" : undefined}
			{...formControlContext.dataset()}
			{...others}
		>
			<Show when={!isSelectionEmpty()} fallback={context.placeholder()}>
				<SelectValueChild
					state={{
						selectedOption: () => context.selectedOptions()[0],
						selectedOptions: () => context.selectedOptions(),
						remove: (option) => context.removeOptionFromSelection(option),
						clear: () => selectionManager().clearSelection(),
					}}
				>
					{local.children}
				</SelectValueChild>
			</Show>
		</Polymorphic>
	);
}

interface SelectValueChildProps<T>
	extends Pick<SelectValueOptions<T>, "children"> {
	state: SelectValueState<T>;
}

function SelectValueChild<T>(props: SelectValueChildProps<T>) {
	const resolvedChildren = children(() => {
		const body = props.children;
		return isFunction(body) ? body(props.state) : body;
	});

	return <>{resolvedChildren()}</>;
}
