/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-stately/combobox/src/useComboBoxState.ts
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-aria/combobox/src/useComboBox.ts
 */

import {
	type ValidationState,
	access,
	createGenerateId,
	focusWithoutScrolling,
	isAppleDevice,
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
import { createFilter } from "../i18n";
import { ListKeyboardDelegate, createListState } from "../list";
import { announce } from "../live-announcer";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { Popper, type PopperRootOptions } from "../popper";
import {
	type CollectionNode,
	createControllableSignal,
	createDisclosureState,
	createFormResetListener,
	createRegisterId,
	getItemCount,
} from "../primitives";
import {
	type FocusStrategy,
	type KeyboardDelegate,
	Selection,
	type SelectionBehavior,
	type SelectionMode,
	createSelectableCollection,
} from "../selection";
import {
	ComboboxContext,
	type ComboboxContextValue,
	type ComboboxDataSet,
} from "./combobox-context";
import {
	COMBOBOX_INTL_TRANSLATIONS,
	type ComboboxIntlTranslations,
} from "./combobox.intl";
import type { ComboboxTriggerMode } from "./types";

export interface ComboboxBaseItemComponentProps<Option> {
	/** The item to render. */
	item: CollectionNode<Option>;
}

export interface ComboboxBaseSectionComponentProps<OptGroup> {
	/** The section to render. */
	section: CollectionNode<OptGroup>;
}

export interface ComboboxBaseOptions<Option, OptGroup = never>
	extends Omit<
		PopperRootOptions,
		"anchorRef" | "contentRef" | "onCurrentPlacementChange"
	> {
	/** Prevents input reset on combobox blur when content is displayed. */
	noResetInputOnBlur?: boolean;

	/** The localized strings of the component. */
	translations?: ComboboxIntlTranslations;

	/** The controlled open state of the combobox. */
	open?: boolean;

	/**
	 * The default open state when initially rendered.
	 * Useful when you do not need to control the open state.
	 */
	defaultOpen?: boolean;

	/**
	 * Event handler called when the open state of the combobox changes.
	 * Returns the new open state and the action that caused the opening of the menu.
	 */
	onOpenChange?: (isOpen: boolean, triggerMode?: ComboboxTriggerMode) => void;

	/** Handler that is called when the combobox input value changes. */
	onInputChange?: (value: string) => void;

	/** The controlled value of the combobox. */
	value?: Option[];

	/**
	 * The value of the combobox when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: Option[];

	/** Event handler called when the value changes. */
	onChange?: (value: Option[]) => void;

	/** The interaction required to display the combobox menu. */
	triggerMode?: ComboboxTriggerMode;

	/** The content that will be rendered when no value or defaultValue is set. */
	placeholder?: JSX.Element;

	/** An array of options to display as the available options. */
	options: Array<Option | OptGroup>;

	/**
	 * Property name or getter function to use as the value of an option.
	 * This is the value that will be submitted when the combobox is part of a `<form>`.
	 */
	optionValue?:
		| keyof Exclude<Option, null>
		| ((option: Exclude<Option, null>) => string | number);

	/** Property name or getter function to use as the text value of an option for typeahead purpose. */
	optionTextValue?:
		| keyof Exclude<Option, null>
		| ((option: Exclude<Option, null>) => string);

	/**
	 * Property name or getter function to use as the label of an option.
	 * This is the string representation of the option to display in the `Combobox.Input`.
	 */
	optionLabel?:
		| keyof Exclude<Option, null>
		| ((option: Exclude<Option, null>) => string);

	/** Property name or getter function to use as the disabled flag of an option. */
	optionDisabled?:
		| keyof Exclude<Option, null>
		| ((option: Exclude<Option, null>) => boolean);

	/** Property name that refers to the children options of an option group. */
	optionGroupChildren?: keyof Exclude<OptGroup, null>;

	/** An optional keyboard delegate to override the default. */
	keyboardDelegate?: KeyboardDelegate;

	/** The filter function used to determine if an option should be included in the combo box list. */
	defaultFilter?:
		| "startsWith"
		| "endsWith"
		| "contains"
		| ((option: Exclude<Option, null>, inputValue: string) => boolean);

	/** Whether focus should wrap around when the end/start is reached. */
	shouldFocusWrap?: boolean;

	/** Whether the combobox allows the menu to be open when the collection is empty. */
	allowsEmptyCollection?: boolean;

	/** The type of selection that is allowed in the select. */
	selectionMode?: Exclude<SelectionMode, "none">;

	/** How multiple selection should behave in the select. */
	selectionBehavior?: SelectionBehavior;

	/** Whether onValueChange should fire even if the new set of keys is the same as the last. */
	allowDuplicateSelectionEvents?: boolean;

	/** Whether the combobox allows empty selection. */
	disallowEmptySelection?: boolean;

	/** Whether the combobox closes after selection. */
	closeOnSelection?: boolean;

	/**
	 * When `selectionMode` is "multiple".
	 * Whether the last selected option should be removed when the user press the Backspace key and the input is empty.
	 */
	removeOnBackspace?: boolean;

	/** Whether the combobox uses virtual scrolling. */
	virtualized?: boolean;

	/** When NOT virtualized, the component to render as an item in the `Combobox.Listbox`. */
	itemComponent?: Component<ComboboxBaseItemComponentProps<Option>>;

	/** When NOT virtualized, the component to render as a section in the `Combobox.Listbox`. */
	sectionComponent?: Component<ComboboxBaseSectionComponentProps<OptGroup>>;

	/**
	 * Whether the combobox should be the only visible content for screen readers.
	 * When set to `true`:
	 * - interaction with outside elements will be disabled.
	 * - scroll will be locked.
	 * - focus will be locked inside the select content.
	 * - elements outside the combobox content will not be visible for screen readers.
	 */
	modal?: boolean;

	/** Whether the scroll should be locked even if the combobox is not modal. */
	preventScroll?: boolean;

	/**
	 * Used to force mounting the combobox (portal, positioner and content) when more control is needed.
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
	 * The name of the combobox.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the combobox should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must select an item before the owning form can be submitted. */
	required?: boolean;

	/** Whether the combobox is disabled. */
	disabled?: boolean;

	/** Whether the combobox is read only. */
	readOnly?: boolean;
}

export interface ComboboxBaseCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface ComboboxBaseRenderProps
	extends ComboboxBaseCommonProps,
		FormControlDataSet,
		ComboboxDataSet {
	role: "group";
}

export type ComboboxBaseProps<
	Option,
	OptGroup = never,
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ComboboxBaseOptions<Option, OptGroup> &
	Partial<ComboboxBaseCommonProps<ElementOf<T>>>;

/**
 * Base component for a combobox, provide context for its children.
 */
export function ComboboxBase<
	Option,
	OptGroup = never,
	T extends ValidComponent = "div",
>(props: PolymorphicProps<T, ComboboxBaseProps<Option, OptGroup, T>>) {
	const defaultId = `combobox-${createUniqueId()}`;

	const filter = createFilter({ sensitivity: "base" });

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			selectionMode: "single",
			allowsEmptyCollection: false,
			disallowEmptySelection: false,
			allowDuplicateSelectionEvents: true,
			closeOnSelection: props.selectionMode === "single",
			removeOnBackspace: true,
			gutter: 8,
			sameWidth: true,
			modal: false,
			defaultFilter: "contains",
			triggerMode: "input",
			translations: COMBOBOX_INTL_TRANSLATIONS,
		},
		props as ComboboxBaseProps<Option, OptGroup>,
	);

	const [local, popperProps, formControlProps, others] = splitProps(
		mergedProps,
		[
			"noResetInputOnBlur",
			"translations",
			"itemComponent",
			"sectionComponent",
			"open",
			"defaultOpen",
			"onOpenChange",
			"onInputChange",
			"value",
			"defaultValue",
			"onChange",
			"triggerMode",
			"placeholder",
			"options",
			"optionValue",
			"optionTextValue",
			"optionLabel",
			"optionDisabled",
			"optionGroupChildren",
			"keyboardDelegate",
			"allowDuplicateSelectionEvents",
			"disallowEmptySelection",
			"defaultFilter",
			"shouldFocusWrap",
			"allowsEmptyCollection",
			"closeOnSelection",
			"removeOnBackspace",
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

	const [listboxId, setListboxId] = createSignal<string>();

	const [controlRef, setControlRef] = createSignal<HTMLElement>();
	const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
	const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
	const [contentRef, setContentRef] = createSignal<HTMLElement>();
	const [listboxRef, setListboxRef] = createSignal<HTMLElement>();

	const [focusStrategy, setFocusStrategy] = createSignal<
		FocusStrategy | boolean
	>(false);

	const [isInputFocused, setIsInputFocusedState] = createSignal(false);

	const [showAllOptions, setShowAllOptions] = createSignal(false);

	const [lastDisplayedOptions, setLastDisplayedOptions] = createSignal(
		local.options!,
	);

	const disclosureState = createDisclosureState({
		open: () => local.open,
		defaultOpen: () => local.defaultOpen,
		onOpenChange: (isOpen) => local.onOpenChange?.(isOpen, openTriggerMode),
	});

	const [inputValue, setInputValue] = createControllableSignal<string>({
		defaultValue: () => "",
		onChange: (value) => {
			local.onInputChange?.(value);

			// Remove selection when input is cleared and value is uncontrolled (in single selection mode).
			// If controlled, this is the application developer's responsibility.
			if (
				value === "" &&
				local.selectionMode === "single" &&
				!listState.selectionManager().isEmpty() &&
				local.value === undefined
			) {
				// Bypass `disallowEmptySelection`.
				listState.selectionManager().setSelectedKeys([]);
			}

			// Clear focused key when input value changes.
			listState.selectionManager().setFocusedKey(undefined);
		},
	});

	const getOptionValue = (option: Option) => {
		const optionValue = local.optionValue;

		if (optionValue == null) {
			// If no `optionValue`, the option itself is the value (ex: string[] of options).
			return String(option);
		}

		// Get the value from the option object as a string.
		return String(
			isFunction(optionValue)
				? optionValue(option as any)
				: (option as any)[optionValue],
		);
	};

	const getOptionLabel = (option: Option) => {
		const optionLabel = local.optionLabel;

		if (optionLabel == null) {
			// If no `optionLabel`, the option itself is the label (ex: string[] of options).
			return String(option);
		}

		// Get the label from the option object as a string.
		return String(
			isFunction(optionLabel)
				? optionLabel(option as any)
				: (option as any)[optionLabel],
		);
	};

	const getOptionTextValue = (option: Option) => {
		const optionTextValue = local.optionTextValue;

		if (optionTextValue == null) {
			// If no `optionTextValue`, the option itself is the label (ex: string[] of options).
			return String(option);
		}

		// Get the label from the option object as a string.
		return String(
			isFunction(optionTextValue)
				? optionTextValue(option as any)
				: (option as any)[optionTextValue],
		);
	};

	// All options flattened without option groups.
	const allOptions = createMemo(() => {
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

	const filterFn = (option: Option) => {
		const inputVal = inputValue() ?? "";

		if (isFunction(local.defaultFilter)) {
			return local.defaultFilter?.(option as any, inputVal);
		}

		const textVal = getOptionTextValue(option);

		switch (local.defaultFilter) {
			case "startsWith":
				return filter.startsWith(textVal, inputVal);
			case "endsWith":
				return filter.endsWith(textVal, inputVal);
			case "contains":
				return filter.contains(textVal, inputVal);
		}
	};

	// Filtered options with same structure as `local.options`
	const filteredOptions = createMemo(() => {
		const optionGroupChildren = local.optionGroupChildren;

		// The combobox doesn't contains option groups.
		if (optionGroupChildren == null) {
			return (local.options as Option[]).filter(filterFn);
		}

		const filteredGroups: OptGroup[] = [];
		for (const optGroup of local.options as OptGroup[]) {
			// Filter options of the group
			const filteredChildrenOptions = (
				(optGroup as any)[optionGroupChildren] as Option[]
			).filter(filterFn);
			// Don't add any groups that are empty
			if (filteredChildrenOptions.length === 0) continue;

			// Add the group with the filtered options
			filteredGroups.push({
				...optGroup,
				[optionGroupChildren]: filteredChildrenOptions,
			});
		}

		return filteredGroups;
	});

	const displayedOptions = createMemo(() => {
		if (disclosureState.isOpen()) {
			if (showAllOptions()) {
				return local.options!;
			}
			return filteredOptions();
		}
		return lastDisplayedOptions();
	});

	// Track what action is attempting to open the combobox.
	let openTriggerMode: ComboboxTriggerMode | undefined = "focus";

	const getOptionsFromValues = (values: Set<string>): Option[] => {
		return [...values]
			.map((value) =>
				allOptions().find((option) => getOptionValue(option) === value),
			)
			.filter((option) => option != null) as Option[];
	};

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
				// Only close if an option is selected.
				// Prevents the combobox to close and reopen when the input is cleared.
				if (disclosureState.isOpen() && selectedKeys.size > 0) {
					close();
					setTimeout(close);
				}
			}

			const inputEl = inputRef();

			if (inputEl) {
				// Move cursor to the end of the input.
				inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);

				focusWithoutScrolling(inputEl);
			}
		},
		allowDuplicateSelectionEvents: () =>
			access(local.allowDuplicateSelectionEvents),
		disallowEmptySelection: () => local.disallowEmptySelection,
		selectionBehavior: () => access(local.selectionBehavior),
		selectionMode: () => local.selectionMode,
		dataSource: displayedOptions,
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

	const open = (
		focusStrategy: FocusStrategy | boolean,
		triggerMode?: ComboboxTriggerMode,
	) => {
		// If set to only open manually, ignore other triggers
		if (local.triggerMode === "manual" && triggerMode !== "manual") {
			return;
		}

		// Show all option if menu is manually opened.
		const showAllOptions = setShowAllOptions(triggerMode === "manual");

		const hasOptions = showAllOptions
			? local.options!.length > 0
			: filteredOptions().length > 0;

		// Don't open if there is no option.
		if (!hasOptions && !local.allowsEmptyCollection) {
			return;
		}

		openTriggerMode = triggerMode;
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

		listState.selectionManager().setFocused(true);
		listState.selectionManager().setFocusedKey(focusedKey);
	};

	const close = () => {
		disclosureState.close();

		listState.selectionManager().setFocused(false);
		listState.selectionManager().setFocusedKey(undefined);
	};

	const toggle = (
		focusStrategy: FocusStrategy | boolean,
		triggerMode?: ComboboxTriggerMode,
	) => {
		if (disclosureState.isOpen()) {
			close();
		} else {
			open(focusStrategy, triggerMode);
		}
	};

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(inputRef, () => {
		const defaultSelectedKeys = local.defaultValue
			? [...local.defaultValue].map(getOptionValue)
			: new Selection();

		listState.selectionManager().setSelectedKeys(defaultSelectedKeys);
	});

	// By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
	const delegate = createMemo(() => {
		const keyboardDelegate = access(local.keyboardDelegate);

		if (keyboardDelegate) {
			return keyboardDelegate;
		}

		return new ListKeyboardDelegate(
			listState.collection,
			listboxRef,
			undefined,
		);
	});

	// Use `createSelectableCollection` to get the keyboard handlers to apply to the input.
	const selectableCollection = createSelectableCollection(
		{
			selectionManager: () => listState.selectionManager(),
			keyboardDelegate: delegate,
			disallowTypeAhead: true,
			disallowEmptySelection: true,
			shouldFocusWrap: () => local.shouldFocusWrap,
			// Prevent item scroll behavior from being applied here, handled in the Listbox component.
			isVirtualized: true,
		},
		inputRef,
	);

	const setIsInputFocused = (isFocused: boolean) => {
		if (isFocused && local.triggerMode === "focus") {
			open(false, "focus");
		}

		setIsInputFocusedState(isFocused);
		listState.selectionManager().setFocused(isFocused);
	};

	const activeDescendant = createMemo(() => {
		const focusedKey = listState.selectionManager().focusedKey();

		if (focusedKey) {
			return listboxRef()?.querySelector(`[data-key="${focusedKey}"]`)?.id;
		}

		return undefined;
	});

	const resetInputValue = (selectedKeys: Set<string>) => {
		if (local.selectionMode === "single") {
			const selectedKey = [...selectedKeys][0];

			const selectedOption = allOptions().find(
				(option) => getOptionValue(option) === selectedKey,
			);
			if (local.noResetInputOnBlur && !selectedOption) return;
			setInputValue(selectedOption ? getOptionLabel(selectedOption) : "");
		} else {
			if (local.noResetInputOnBlur) return;
			setInputValue("");
		}
	};

	const renderItem = (item: CollectionNode) => {
		return local.itemComponent?.({ item });
	};

	const renderSection = (section: CollectionNode) => {
		return local.sectionComponent?.({ section });
	};

	// If combobox is going to close, freeze the displayed options
	// Prevents the popover contents from updating as the combobox closes.
	createEffect(
		on([filteredOptions, showAllOptions], (input, prevInput) => {
			if (disclosureState.isOpen() && prevInput != null) {
				const prevFilteredOptions = prevInput[0];
				const prevShowAllOptions = prevInput[1];

				setLastDisplayedOptions(
					prevShowAllOptions ? local.options! : prevFilteredOptions,
				);
			} else {
				const filteredOptions = input[0];
				const showAllOptions = input[1];

				setLastDisplayedOptions(
					showAllOptions ? local.options! : filteredOptions,
				);
			}
		}),
	);

	// Display filtered collection again when input value changes.
	createEffect(
		on(inputValue, () => {
			if (showAllOptions()) {
				setShowAllOptions(false);
			}
		}),
	);

	// Reset input value when selection change
	createEffect(
		on(() => listState.selectionManager().selectedKeys(), resetInputValue),
	);

	// VoiceOver has issues with announcing aria-activedescendant properly on change.
	// We use a live region announcer to announce focus changes manually.
	let lastAnnouncedFocusedKey = "";

	createEffect(() => {
		const focusedKey = listState.selectionManager().focusedKey() ?? "";
		const focusedItem = listState.collection().getItem(focusedKey);

		if (
			isAppleDevice() &&
			focusedItem != null &&
			focusedKey !== lastAnnouncedFocusedKey
		) {
			const isSelected = listState.selectionManager().isSelected(focusedKey);

			const announcement =
				local.translations?.focusAnnouncement(
					focusedItem?.textValue || "",
					isSelected,
				) ?? "";

			announce(announcement);
		}

		if (focusedKey) {
			lastAnnouncedFocusedKey = focusedKey;
		}
	});

	// Announce the number of available suggestions when it changes.
	let lastOptionCount = getItemCount(listState.collection());
	let lastOpen = disclosureState.isOpen();

	createEffect(() => {
		const optionCount = getItemCount(listState.collection());
		const isOpen = disclosureState.isOpen();

		// Only announce the number of options available when the menu opens if there is no
		// focused item, otherwise screen readers will typically read e.g. "1 of 6".
		// The exception is VoiceOver since this isn't included in the message above.
		const didOpenWithoutFocusedItem =
			isOpen !== lastOpen &&
			(listState.selectionManager().focusedKey() == null || isAppleDevice());

		if (
			isOpen &&
			(didOpenWithoutFocusedItem || optionCount !== lastOptionCount)
		) {
			const announcement =
				local.translations?.countAnnouncement(optionCount) ?? "";
			announce(announcement);
		}

		lastOptionCount = optionCount;
		lastOpen = isOpen;
	});

	// Announce when a selection occurs for VoiceOver.
	// Other screen readers typically do this automatically.
	let lastAnnouncedSelectedKey = "";

	createEffect(() => {
		const lastSelectedKey =
			[...listState.selectionManager().selectedKeys()].pop() ?? "";
		const lastSelectedItem = listState.collection().getItem(lastSelectedKey);

		if (
			isAppleDevice() &&
			isInputFocused() &&
			lastSelectedItem &&
			lastSelectedKey !== lastAnnouncedSelectedKey
		) {
			const announcement =
				local.translations?.selectedAnnouncement(
					lastSelectedItem?.textValue || "",
				) ?? "";

			announce(announcement);
		}

		if (lastSelectedKey) {
			lastAnnouncedSelectedKey = lastSelectedKey;
		}
	});

	const dataset: Accessor<ComboboxDataSet> = createMemo(() => ({
		"data-expanded": disclosureState.isOpen() ? "" : undefined,
		"data-closed": !disclosureState.isOpen() ? "" : undefined,
	}));

	const context: ComboboxContextValue = {
		dataset,
		isOpen: disclosureState.isOpen,
		isDisabled: () => formControlContext.isDisabled() ?? false,
		isMultiple: () => access(local.selectionMode) === "multiple",
		isVirtualized: () => local.virtualized ?? false,
		isModal: () => local.modal ?? false,
		preventScroll: () => local.preventScroll ?? context.isModal(),
		allowsEmptyCollection: () => local.allowsEmptyCollection ?? false,
		shouldFocusWrap: () => local.shouldFocusWrap ?? false,
		removeOnBackspace: () => local.removeOnBackspace ?? true,
		selectedOptions,
		isInputFocused,
		contentPresent,
		autoFocus: focusStrategy,
		inputValue,
		triggerMode: () => local.triggerMode!,
		activeDescendant,
		controlRef,
		inputRef,
		triggerRef,
		contentRef,
		listState: () => listState,
		keyboardDelegate: delegate,
		listboxId,
		triggerAriaLabel: () => local.translations?.triggerLabel,
		listboxAriaLabel: () => local.translations?.listboxLabel,
		setIsInputFocused,
		resetInputValue,
		setInputValue,
		setControlRef,
		setInputRef,
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
		onInputKeyDown: (e) => selectableCollection.onKeyDown(e),
		generateId: createGenerateId(() => access(formControlProps.id)!),
		registerListboxId: createRegisterId(setListboxId),
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<ComboboxContext.Provider value={context}>
				<Popper anchorRef={controlRef} contentRef={contentRef} {...popperProps}>
					<Polymorphic<ComboboxBaseRenderProps>
						as="div"
						role="group"
						id={access(formControlProps.id)!}
						{...formControlContext.dataset()}
						{...dataset()}
						{...others}
					/>
				</Popper>
			</ComboboxContext.Provider>
		</FormControlContext.Provider>
	);
}
