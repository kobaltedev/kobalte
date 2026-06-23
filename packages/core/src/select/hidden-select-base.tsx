/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/select/src/HiddenSelect.tsx
 */

import { callHandler, mergeRefs, visuallyHiddenStyles } from "@kobalte/utils";
import type { ComponentProps } from "@solidjs/web";
import {
	For,
	Show,
	createEffect,
	omit,
} from "solid-js";

import { useFormControlContext } from "../form-control";
import type { Collection, CollectionNode } from "../primitives";
import type { SelectionManager } from "../selection";
import { isSameSelection } from "../selection/utils";

// In Safari, the <select> cannot have `display: none` or `hidden` for autofill to work.
// In Firefox, there must be a <label> to identify the <select> whereas other browsers
// seem to identify it just by surrounding text.
// The solution is to use <VisuallyHidden> to hide the elements, which clips the elements to a
// 1px rectangle. In addition, we hide from screen readers with aria-hidden, and make the <select>
// non tabbable with tabIndex={-1}.
//
// In mobile browsers, there are next/previous buttons above the software keyboard for navigating
// between fields in a form. These only support native form inputs that are tabbable. In order to
// support those, an additional hidden input is used to marshall focus to the button. It is tabbable
// except when the button is focused, so that shift tab works properly to go to the actual previous
// input in the form. Using the <select> for this also works, but Safari on iOS briefly flashes
// the native menu on focus, so this isn't ideal. A font-size of 16px or greater is required to
// prevent Safari from zooming in on the input when it is focused.
//
// If the current interaction modality is null, then the user hasn't interacted with the page yet.
// In this case, we set the tabIndex to -1 on the input element so that automated accessibility
// checkers don't throw false-positives about focusable elements inside an aria-hidden parent.

export interface HiddenSelectBaseProps extends ComponentProps<"select"> {
	collection: Collection<CollectionNode>;
	selectionManager: SelectionManager;
	isOpen: boolean;
	isMultiple: boolean;
	isVirtualized: boolean;
	focusTrigger: () => void;
}

/**
 * Renders a hidden native `<select>` element, which can be used to support browser
 * form autofill, mobile form navigation, and native form submission.
 */
export function HiddenSelectBase(props: HiddenSelectBaseProps) {
	let ref: HTMLSelectElement | undefined;

	const others = omit(props, "ref", "onChange", "collection", "selectionManager", "isOpen", "isMultiple", "isVirtualized", "focusTrigger");

	const formControlContext = useFormControlContext();

	let isInternalChangeEvent = false;

	const renderOption = (key: string) => {
		const item = props.collection.getItem(key);

		return (
			<Show when={item?.type === "item"}>
				<option value={key} selected={props.selectionManager.isSelected(key)}>
					{item?.textValue}
				</option>
			</Show>
		);
	};

	// Dispatch native event on selection change for form libraries.
	createEffect(
		() => props.selectionManager.selectedKeys(),
		(keys, prevKeys) => {
			if (prevKeys && isSameSelection(keys, prevKeys)) {
				return;
			}

			isInternalChangeEvent = true;

			ref?.dispatchEvent(
				new Event("input", { bubbles: true, cancelable: true }),
			);
			ref?.dispatchEvent(
				new Event("change", { bubbles: true, cancelable: true }),
			);
		},
		{ defer: true },
	);

	// If virtualized, only render the selected options in the hidden <select> so the value can be submitted to a server.
	// Otherwise, render all options so that browser autofill will work.
	return (
		<div style={visuallyHiddenStyles} aria-hidden="true">
			<input
				type="text"
				tabindex={props.selectionManager.isFocused() || props.isOpen ? -1 : 0}
				style={{ "font-size": "16px" }}
				required={formControlContext.isRequired()}
				disabled={formControlContext.isDisabled()}
				readonly={formControlContext.isReadOnly()}
				onFocus={() => props.focusTrigger()}
			/>
			<select
				ref={mergeRefs((el) => (ref = el), props.ref)}
				tabindex={-1}
				multiple={props.isMultiple}
				name={formControlContext.name()}
				required={formControlContext.isRequired()}
				disabled={formControlContext.isDisabled()}
				size={props.collection.getSize()}
				value={props.selectionManager.firstSelectedKey() ?? ""}
				onChange={(e) => {
					callHandler(e, props.onChange);

					// Prevent internally fired change event to update the selection
					// which would result in an infinite loop.
					if (!isInternalChangeEvent) {
						// enable form autofill
						props.selectionManager.setSelectedKeys(
							new Set([(e.target as HTMLSelectElement).value]),
						);
					}

					isInternalChangeEvent = false;
				}}
				{...others}
			>
				<option />
				<Show
					when={props.isVirtualized}
					fallback={
						<For each={[...props.collection.getKeys()]}>{renderOption}</For>
					}
				>
					<For each={[...props.selectionManager.selectedKeys()]}>
						{renderOption}
					</For>
				</Show>
			</select>
		</div>
	);
}
