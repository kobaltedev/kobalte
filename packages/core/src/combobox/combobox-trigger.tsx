/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-stately/combobox/src/useComboBoxState.ts
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-aria/combobox/src/useComboBox.ts
 */

import {
	OverrideComponentProps,
	callHandler,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";

import * as Button from "../button";
import { useFormControlContext } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { type ComboboxDataSet, useComboboxContext } from "./combobox-context";

export interface ComboboxTriggerOptions {}

export interface ComboboxTriggerCommonProps<T extends HTMLElement = HTMLElement>
	extends Button.ButtonRootCommonProps<T> {
	id: string;
	ref: T | ((el: T) => void);
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	"aria-labelledby": string | undefined;
}

export interface ComboboxTriggerRenderProps
	extends ComboboxTriggerCommonProps,
		ComboboxDataSet,
		Button.ButtonRootRenderProps {
	"aria-label": string | undefined;
	"aria-haspopup": "listbox";
	"aria-expanded": boolean;
	"aria-controls": string | undefined;
}

export type ComboboxTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ComboboxTriggerOptions & Partial<ComboboxTriggerCommonProps<ElementOf<T>>>;

export function ComboboxTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, ComboboxTriggerProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useComboboxContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("trigger"),
		},
		props as ComboboxTriggerProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"disabled",
		"onPointerDown",
		"onClick",
		"aria-labelledby",
	]);

	const isDisabled = () => {
		return (
			local.disabled ||
			context.isDisabled() ||
			formControlContext.isDisabled() ||
			formControlContext.isReadOnly()
		);
	};

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerDown);

		e.currentTarget.dataset.pointerType = e.pointerType;

		// For consistency with native, open the combobox on mouse down (main button), but touch up.
		if (!isDisabled() && e.pointerType !== "touch" && e.button === 0) {
			// prevent trigger from stealing focus from the active item after opening.
			e.preventDefault();

			context.toggle(false, "manual");
		}
	};

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		if (!isDisabled()) {
			if (e.currentTarget.dataset.pointerType === "touch") {
				context.toggle(false, "manual");
			}

			// Focus the input field in case it isn't focused yet.
			context.inputRef()?.focus();
		}
	};

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			others.id,
			context.triggerAriaLabel(),
			local["aria-labelledby"],
		);
	};

	return (
		<Button.Root<
			Component<
				Omit<ComboboxTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			ref={mergeRefs(context.setTriggerRef, local.ref)}
			disabled={isDisabled()}
			tabIndex={-1}
			aria-haspopup="listbox"
			aria-expanded={context.isOpen()}
			aria-controls={context.isOpen() ? context.listboxId() : undefined}
			aria-label={context.triggerAriaLabel()}
			aria-labelledby={ariaLabelledBy()}
			onPointerDown={onPointerDown}
			onClick={onClick}
			{...context.dataset()}
			{...others}
		/>
	);
}
