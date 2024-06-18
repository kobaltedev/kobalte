import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import { useFormControlContext } from "../form-control";
import * as Listbox from "../listbox";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxListboxOptions<Option, OptGroup = never>
	extends Pick<
		Listbox.ListboxRootOptions<Option, OptGroup>,
		"scrollRef" | "scrollToItem" | "children"
	> {}

export interface ComboboxListboxCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface ComboboxListboxRenderProps
	extends ComboboxListboxCommonProps,
		Listbox.ListboxRootRenderProps {
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
}

export type ComboboxListboxProps<
	Option,
	OptGroup = never,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ComboboxListboxOptions<Option, OptGroup> &
	Partial<ComboboxListboxCommonProps<ElementOf<T>>>;

/**
 * Contains all the items of a `Combobox`.
 */
export function ComboboxListbox<
	Option = any,
	OptGroup = never,
	T extends ValidComponent = "ul",
>(props: PolymorphicProps<T, ComboboxListboxProps<Option, OptGroup, T>>) {
	const formControlContext = useFormControlContext();
	const context = useComboboxContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("listbox"),
		},
		props as ComboboxListboxProps<Option, OptGroup>,
	);

	const [local, others] = splitProps(mergedProps, ["ref"]);

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			others.id,
			context.listboxAriaLabel(),
			undefined,
		);
	};

	createEffect(() => onCleanup(context.registerListboxId(others.id!)));

	return (
		<Listbox.Root<
			Option,
			OptGroup,
			Component<
				Omit<ComboboxListboxRenderProps, keyof Listbox.ListboxRootRenderProps>
			>
		>
			ref={mergeRefs(context.setListboxRef, local.ref)}
			state={context.listState()}
			autoFocus={context.autoFocus()}
			shouldUseVirtualFocus
			shouldSelectOnPressUp
			shouldFocusOnHover
			aria-label={context.listboxAriaLabel()}
			aria-labelledby={ariaLabelledBy()}
			renderItem={context.renderItem}
			renderSection={context.renderSection}
			virtualized={context.isVirtualized()}
			{...others}
		/>
	);
}
