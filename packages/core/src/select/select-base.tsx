/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/useSelect.ts
 */

import {
	OverrideComponentProps,
	type ValidationState,
	access,
	createGenerateId,
	focusWithoutScrolling,
	isFunction,
	mergeDefaultProps,
} from "@kobalte/utils";
import {
	type Accessor,
	type Component,
	type JSX,
	type ValidComponent,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	on,
	splitProps,
} from "solid-js";

import createPresence from "solid-presence";
import {
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
	createFormControl,
} from "../form-control";
import { createCollator } from "../i18n";
import { ListKeyboardDelegate, createListState } from "../list";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { Popper, type PopperRootOptions } from "../popper";
import {
	type CollectionNode,
	createDisclosureState,
	createFormResetListener,
	createRegisterId,
} from "../primitives";
import {
	type FocusStrategy,
	type KeyboardDelegate,
	Selection,
	type SelectionBehavior,
	type SelectionMode,
} from "../selection";
import {
	SelectContext,
	type SelectContextValue,
	type SelectDataSet,
} from "./select-context";

export interface SelectBaseItemComponentProps<T> {
	/** The item to render. */
	item: CollectionNode<T>;
}

export interface SelectBaseSectionComponentProps<T> {
	/** The section to render. */
	section: CollectionNode<T>;
}

export interface SelectBaseOptions<Option, OptGroup = never>
	extends Omit<
		PopperRootOptions,
		"anchorRef" | "contentRef" | "onCurrentPlacementChange"
	> {
	/** The controlled open state of the select. */
	open?: boolean;

	/**
	 * The default open state when initially rendered.
	 * Useful when you do not need to control the open state.
	 */
	defaultOpen?: boolean;

	/** Event handler called when the open state of the select changes. */
	onOpenChange?: (isOpen: boolean) => void;

	/** The controlled value of the select. */
	value?: Option[];

	/**
	 * The value of the select when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: Option[];

	/** Event handler called when the value changes. */
	onChange?: (value: Option[]) => void;

	/** The content that will be rendered when no value or defaultValue is set. */
	placeholder?: JSX.Element;

	/** An array of options to display as the available options. */
	options: Array<Option | OptGroup>;

	/**
	 * Property name or getter function to use as the value of an option.
	 * This is the value that will be submitted when the select is part of a `<form>`.
	 */
	optionValue?:
		| keyof Exclude<Option, null>
		| ((option: Exclude<Option, null>) => string | number);

	/** Property name or getter function to use as the text value of an option for typeahead purpose. */
	optionTextValue?:
		| keyof Exclude<Option, null>
		| ((option: Exclude<Option, null>) => string);

	/** Property name or getter function to use as the disabled flag of an option. */
	optionDisabled?:
		| keyof Exclude<Option, null>
		| ((option: Exclude<Option, null>) => boolean);

	/** Property name that refers to the children options of an option group. */
	optionGroupChildren?: keyof Exclude<OptGroup, null>;

	/** An optional keyboard delegate implementation for type to select, to override the default. */
	keyboardDelegate?: KeyboardDelegate;

	/** Whether focus should wrap around when the end/start is reached. */
	shouldFocusWrap?: boolean;

	/** The type of selection that is allowed in the select. */
	selectionMode?: Exclude<SelectionMode, "none">;

	/** How multiple selection should behave in the select. */
	selectionBehavior?: SelectionBehavior;

	/** Whether onValueChange should fire even if the new set of keys is the same as the last. */
	allowDuplicateSelectionEvents?: boolean;

	/** Whether the select allows empty selection. */
	disallowEmptySelection?: boolean;

	/** Whether the select closes after selection. */
	closeOnSelection?: boolean;

	/** Whether typeahead is disabled. */
	disallowTypeAhead?: boolean;

	/** Whether the select uses virtual scrolling. */
	virtualized?: boolean;

	/** When NOT virtualized, the component to render as an item in the `Select.Listbox`. */
	itemComponent?: Component<SelectBaseItemComponentProps<Option>>;

	/** When NOT virtualized, the component to render as a section in the `Select.Listbox`. */
	sectionComponent?: Component<SelectBaseSectionComponentProps<OptGroup>>;

	/**
	 * Whether the select should be the only visible content for screen readers.
	 * When set to `true`:
	 * - interaction with outside elements will be disabled.
	 * - scroll will be locked.
	 * - focus will be locked inside the select content.
	 * - elements outside the select content will not be visible for screen readers.
	 */
	modal?: boolean;

	/** Whether the scroll should be locked even if the select is not modal. */
	preventScroll?: boolean;

	/**
	 * Used to force mounting the select (portal, positioner and content) when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the select.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the select should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must select an item before the owning form can be submitted. */
	required?: boolean;

	/** Whether the select is disabled. */
	disabled?: boolean;

	/** Whether the select is read only. */
	readOnly?: boolean;
}

export interface SelectBaseCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface SelectBaseRenderProps
	extends SelectBaseCommonProps,
		SelectDataSet,
		FormControlDataSet {
	role: "group";
}

export type SelectBaseProps<
	Option,
	OptGroup = never,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SelectBaseOptions<Option, OptGroup> &
	Partial<SelectBaseCommonProps<ElementOf<T>>>;

/**
 * Base component for a select, provide context for its children.
 * Used to build single and multi-select.
 */
export function SelectBase<
	Option,
	OptGroup = never,
	T extends ValidComponent = "div",
>(props: PolymorphicProps<T, SelectBaseProps<Option, OptGroup, T>>) {
	const defaultId = `select-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			selectionMode: "single",
			disallowEmptySelection: false,
			closeOnSelection: props.selectionMode === "single",
			allowDuplicateSelectionEvents: true,
			gutter: 8,
			sameWidth: true,
			modal: false,
		},
		props as SelectBaseProps<Option, OptGroup>,
	);

	const [local, popperProps, formControlProps, others] = splitProps(
		mergedProps,
		[
			"itemComponent",
			"sectionComponent",
			"open",
			"defaultOpen",
			"onOpenChange",
			"value",
			"defaultValue",
			"onChange",
			"placeholder",
			"options",
			"optionValue",
			"optionTextValue",
			"optionDisabled",
			"optionGroupChildren",
			"keyboardDelegate",
			"allowDuplicateSelectionEvents",
			"disallowEmptySelection",
			"closeOnSelection",
			"disallowTypeAhead",
			"shouldFocusWrap",
			"selectionBehavior",
			"selectionMode",
			"virtualized",
			"modal",
			"preventScroll",
			"forceMount",
		],
		[
			"getAnchorRect",
			"placement",
			"gutter",
			"shift",
			"flip",
			"slide",
			"overlap",
			"sameWidth",
			"fitViewport",
			"hideWhenDetached",
			"detachedPadding",
			"arrowPadding",
			"overflowPadding",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const [triggerId, setTriggerId] = createSignal<string>();
	const [valueId, setValueId] = createSignal<string>();
	const [listboxId, setListboxId] = createSignal<string>();

	const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();
	const [contentRef, setContentRef] = createSignal<HTMLDivElement>();
	const [listboxRef, setListboxRef] = createSignal<HTMLUListElement>();

	const [listboxAriaLabelledBy, setListboxAriaLabelledBy] =
		createSignal<string>();
	const [focusStrategy, setFocusStrategy] = createSignal<
		FocusStrategy | boolean
	>(true);

	const getOptionValue = (option: Option): string => {
		const optionValue = local.optionValue;

		if (optionValue == null) {
			// If no `optionValue`, the option itself is the value (ex: string[] of options)
			return String(option);
		}

		// Get the value from the option object as a string.
		return String(
			isFunction(optionValue)
				? optionValue(option as any)
				: (option as any)[optionValue],
		);
	};

	// Only options without option groups.
	const flattenOptions = createMemo(() => {
		const optionGroupChildren = local.optionGroupChildren;

		// The combobox doesn't contains option groups.
		if (optionGroupChildren == null) {
			return local.options as Option[];
		}

		return local.options!.flatMap(
			(item) =>
				((item as any)[optionGroupChildren] as Option[]) ?? (item as Option),
		);
	});

	// Only option keys without option groups.
	const flattenOptionKeys = createMemo(() => {
		return flattenOptions().map((option) => getOptionValue(option));
	});

	const getOptionsFromValues = (values: Set<string>): Option[] => {
		return [...values]
			.map((value) =>
				flattenOptions().find((option) => getOptionValue(option) === value),
			)
			.filter((option) => option != null) as Option[];
	};

	const disclosureState = createDisclosureState({
		open: () => local.open,
		defaultOpen: () => local.defaultOpen,
		onOpenChange: (isOpen) => local.onOpenChange?.(isOpen),
	});

	const listState = createListState({
		selectedKeys: () => {
			if (local.value != null) {
				return local.value.map(getOptionValue);
			}

			return local.value;
		},
		defaultSelectedKeys: () => {
			if (local.defaultValue != null) {
				return local.defaultValue.map(getOptionValue);
			}

			return local.defaultValue;
		},
		onSelectionChange: (selectedKeys) => {
			local.onChange?.(getOptionsFromValues(selectedKeys));

			if (local.closeOnSelection) {
				close();
			}
		},
		allowDuplicateSelectionEvents: () =>
			access(local.allowDuplicateSelectionEvents),
		disallowEmptySelection: () => access(local.disallowEmptySelection),
		selectionBehavior: () => access(local.selectionBehavior),
		selectionMode: () => local.selectionMode,
		dataSource: () => local.options ?? [],
		getKey: () => local.optionValue as any,
		getTextValue: () => local.optionTextValue as any,
		getDisabled: () => local.optionDisabled as any,
		getSectionChildren: () => local.optionGroupChildren as any,
	});

	const selectedOptions = createMemo(() => {
		return getOptionsFromValues(listState.selectionManager().selectedKeys());
	});

	const removeOptionFromSelection = (option: Option) => {
		listState.selectionManager().toggleSelection(getOptionValue(option));
	};

	const { present: contentPresent } = createPresence({
		show: () => local.forceMount || disclosureState.isOpen(),
		element: () => contentRef() ?? null,
	});

	const focusListbox = () => {
		const listboxEl = listboxRef();

		if (listboxEl) {
			focusWithoutScrolling(listboxEl);
		}
	};

	const open = (focusStrategy: FocusStrategy | boolean) => {
		// Don't open if there is no option.
		if (local.options!.length <= 0) {
			return;
		}

		setFocusStrategy(focusStrategy);
		disclosureState.open();

		let focusedKey = listState.selectionManager().firstSelectedKey();

		if (focusedKey == null) {
			if (focusStrategy === "first") {
				focusedKey = listState.collection().getFirstKey();
			} else if (focusStrategy === "last") {
				focusedKey = listState.collection().getLastKey();
			}
		}

		focusListbox();
		listState.selectionManager().setFocused(true);
		listState.selectionManager().setFocusedKey(focusedKey);
	};

	const close = () => {
		disclosureState.close();

		listState.selectionManager().setFocused(false);
		listState.selectionManager().setFocusedKey(undefined);
	};

	const toggle = (focusStrategy: FocusStrategy | boolean) => {
		if (disclosureState.isOpen()) {
			close();
		} else {
			open(focusStrategy);
		}
	};

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(triggerRef, () => {
		const defaultSelectedKeys = local.defaultValue
			? [...local.defaultValue].map(getOptionValue)
			: new Selection();

		listState.selectionManager().setSelectedKeys(defaultSelectedKeys);
	});

	const collator = createCollator({ usage: "search", sensitivity: "base" });

	// By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
	const delegate = createMemo(() => {
		const keyboardDelegate = access(local.keyboardDelegate);

		if (keyboardDelegate) {
			return keyboardDelegate;
		}

		return new ListKeyboardDelegate(listState.collection, undefined, collator);
	});

	const renderItem = (item: CollectionNode) => {
		return local.itemComponent?.({ item });
	};

	const renderSection = (section: CollectionNode) => {
		return local.sectionComponent?.({ section });
	};

	// Delete selected keys that do not match any option in the listbox.
	createEffect(
		on(
			[flattenOptionKeys],
			([flattenOptionKeys]) => {
				const currentSelectedKeys = [
					...listState.selectionManager().selectedKeys(),
				];

				const keysToKeep = currentSelectedKeys.filter((key) =>
					flattenOptionKeys.includes(key),
				);

				listState.selectionManager().setSelectedKeys(keysToKeep);
			},
			{
				defer: true,
			},
		),
	);

	const dataset: Accessor<SelectDataSet> = createMemo(() => ({
		"data-expanded": disclosureState.isOpen() ? "" : undefined,
		"data-closed": !disclosureState.isOpen() ? "" : undefined,
	}));

	const context: SelectContextValue = {
		dataset,
		isOpen: disclosureState.isOpen,
		isDisabled: () => formControlContext.isDisabled() ?? false,
		isMultiple: () => access(local.selectionMode) === "multiple",
		isVirtualized: () => local.virtualized ?? false,
		isModal: () => local.modal ?? false,
		preventScroll: () => local.preventScroll ?? context.isModal(),
		disallowTypeAhead: () => local.disallowTypeAhead ?? false,
		shouldFocusWrap: () => local.shouldFocusWrap ?? false,
		selectedOptions,
		contentPresent,
		autoFocus: focusStrategy,
		triggerRef,
		listState: () => listState,
		keyboardDelegate: delegate,
		triggerId,
		valueId,
		listboxId,
		listboxAriaLabelledBy,
		setListboxAriaLabelledBy,
		setTriggerRef,
		setContentRef,
		setListboxRef,
		open,
		close,
		toggle,
		placeholder: () => local.placeholder,
		renderItem,
		renderSection,
		removeOptionFromSelection,
		generateId: createGenerateId(() => access(formControlProps.id)!),
		registerTriggerId: createRegisterId(setTriggerId),
		registerValueId: createRegisterId(setValueId),
		registerListboxId: createRegisterId(setListboxId),
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<SelectContext.Provider value={context}>
				<Popper anchorRef={triggerRef} contentRef={contentRef} {...popperProps}>
					<Polymorphic<SelectBaseRenderProps>
						as="div"
						role="group"
						id={access(formControlProps.id)!}
						{...formControlContext.dataset()}
						{...dataset()}
						{...others}
					/>
				</Popper>
			</SelectContext.Provider>
		</FormControlContext.Provider>
	);
}
