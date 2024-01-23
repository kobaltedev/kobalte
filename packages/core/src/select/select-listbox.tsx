import {
	OverrideComponentProps,
	callHandler,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { JSX, createEffect, onCleanup, splitProps } from "solid-js";

import * as Listbox from "../listbox";
import { useSelectContext } from "./select-context";

export interface SelectListboxOptions<Option, OptGroup = never>
	extends Pick<
		Listbox.ListboxRootOptions<Option, OptGroup>,
		"scrollRef" | "scrollToItem" | "children"
	> {}

export interface SelectListboxProps<Option, OptGroup = never>
	extends Omit<
		OverrideComponentProps<"ul", SelectListboxOptions<Option, OptGroup>>,
		"onChange"
	> {}

/**
 * Contains all the items of a `Select`.
 */
export function SelectListbox<Option = any, OptGroup = never>(
	props: SelectListboxProps<Option, OptGroup>,
) {
	const context = useSelectContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("listbox"),
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "id", "onKeyDown"]);

	createEffect(() => onCleanup(context.registerListboxId(local.id!)));

	const onKeyDown: JSX.EventHandlerUnion<HTMLUListElement, KeyboardEvent> = (
		e,
	) => {
		callHandler(e, local.onKeyDown);

		// Prevent from clearing the selection by `createSelectableCollection` on escape.
		if (e.key === "Escape") {
			e.preventDefault();
		}
	};

	return (
		<Listbox.Root
			ref={mergeRefs(context.setListboxRef, local.ref)}
			id={local.id}
			state={context.listState()}
			virtualized={context.isVirtualized()}
			autoFocus={context.autoFocus()}
			shouldSelectOnPressUp
			shouldFocusOnHover
			shouldFocusWrap={context.shouldFocusWrap()}
			disallowTypeAhead={context.disallowTypeAhead()}
			aria-labelledby={context.listboxAriaLabelledBy()}
			renderItem={context.renderItem}
			renderSection={context.renderSection}
			onKeyDown={onKeyDown}
			{...others}
		/>
	);
}
