/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/useSelect.ts
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/menu/src/useMenuTrigger.ts
 */

import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import * as Button from "../button";
import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	type FormControlDataSet,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { createTypeSelect } from "../selection";
import { type SelectDataSet, useSelectContext } from "./select-context";

export interface SelectTriggerOptions {}

export interface SelectTriggerCommonProps<T extends HTMLElement = HTMLElement>
	extends Button.ButtonRootCommonProps<T> {
	id: string;
	ref: T | ((el: T) => void);
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export interface SelectTriggerRenderProps
	extends SelectTriggerCommonProps,
		SelectDataSet,
		FormControlDataSet,
		Button.ButtonRootRenderProps {
	"aria-haspopup": "listbox";
	"aria-expanded": boolean;
	"aria-controls": string | undefined;
}

export type SelectTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SelectTriggerOptions & Partial<SelectTriggerCommonProps<ElementOf<T>>>;

export function SelectTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, SelectTriggerProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useSelectContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("trigger"),
		},
		props as SelectTriggerProps,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"disabled",
			"onPointerDown",
			"onClick",
			"onKeyDown",
			"onFocus",
			"onBlur",
		],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const selectionManager = () => context.listState().selectionManager();
	const keyboardDelegate = () => context.keyboardDelegate();

	const isDisabled = () => local.disabled || context.isDisabled();

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const { typeSelectHandlers } = createTypeSelect({
		keyboardDelegate: keyboardDelegate,
		selectionManager: selectionManager,
		onTypeSelect: (key) => selectionManager().select(key),
	});

	const ariaLabelledBy = () => {
		return (
			[context.listboxAriaLabelledBy(), context.valueId()]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerDown);

		e.currentTarget.dataset.pointerType = e.pointerType;

		// For consistency with native, open the select on mouse down (main button), but touch up.
		if (!isDisabled() && e.pointerType !== "touch" && e.button === 0) {
			// prevent trigger from stealing focus from the active item after opening.
			e.preventDefault();

			context.toggle(true);
		}
	};

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		if (!isDisabled() && e.currentTarget.dataset.pointerType === "touch") {
			context.toggle(true);
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		if (isDisabled()) {
			return;
		}

		callHandler(e, typeSelectHandlers.onKeyDown);

		switch (e.key) {
			case "Enter":
			case " ":
			case "ArrowDown":
				e.stopPropagation();
				e.preventDefault();
				context.toggle("first");
				break;
			case "ArrowUp":
				e.stopPropagation();
				e.preventDefault();
				context.toggle("last");
				break;
			case "ArrowLeft": {
				// prevent scrolling containers
				e.preventDefault();

				if (context.isMultiple()) {
					return;
				}

				const firstSelectedKey = selectionManager().firstSelectedKey();

				const key =
					firstSelectedKey != null
						? keyboardDelegate().getKeyAbove?.(firstSelectedKey)
						: keyboardDelegate().getFirstKey?.();

				if (key != null) {
					selectionManager().select(key);
				}

				break;
			}
			case "ArrowRight": {
				// prevent scrolling containers
				e.preventDefault();

				if (context.isMultiple()) {
					return;
				}

				const firstSelectedKey = selectionManager().firstSelectedKey();

				const key =
					firstSelectedKey != null
						? keyboardDelegate().getKeyBelow?.(firstSelectedKey)
						: keyboardDelegate().getFirstKey?.();

				if (key != null) {
					selectionManager().select(key);
				}

				break;
			}
		}
	};

	const onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocus);

		if (selectionManager().isFocused()) {
			return;
		}

		selectionManager().setFocused(true);
	};

	const onBlur: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onBlur);

		if (context.isOpen()) {
			return;
		}

		selectionManager().setFocused(false);
	};

	createEffect(() => onCleanup(context.registerTriggerId(fieldProps.id()!)));

	createEffect(() => {
		context.setListboxAriaLabelledBy(
			[
				fieldProps.ariaLabelledBy(),
				fieldProps.ariaLabel() && !fieldProps.ariaLabelledBy()
					? fieldProps.id()
					: null,
			]
				.filter(Boolean)
				.join(" ") || undefined,
		);
	});

	return (
		<Button.Root<
			Component<
				Omit<SelectTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			ref={mergeRefs(context.setTriggerRef, local.ref)}
			id={fieldProps.id()}
			disabled={isDisabled()}
			aria-haspopup="listbox"
			aria-expanded={context.isOpen()}
			aria-controls={context.isOpen() ? context.listboxId() : undefined}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			onPointerDown={onPointerDown}
			onClick={onClick}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
			{...context.dataset()}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
