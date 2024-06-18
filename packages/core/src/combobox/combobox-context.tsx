import { type Accessor, type JSX, createContext, useContext } from "solid-js";

import type { ListState } from "../list";
import type { CollectionNode } from "../primitives";
import type { FocusStrategy, KeyboardDelegate } from "../selection";
import type { ComboboxTriggerMode } from "./types";

export interface ComboboxDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export interface ComboboxContextValue {
	dataset: Accessor<ComboboxDataSet>;
	isOpen: Accessor<boolean>;
	isDisabled: Accessor<boolean>;
	isMultiple: Accessor<boolean>;
	isVirtualized: Accessor<boolean>;
	isModal: Accessor<boolean>;
	preventScroll: Accessor<boolean>;
	isInputFocused: Accessor<boolean>;
	allowsEmptyCollection: Accessor<boolean>;
	shouldFocusWrap: Accessor<boolean>;
	removeOnBackspace: Accessor<boolean>;
	selectedOptions: Accessor<any[]>;
	contentPresent: Accessor<boolean>;
	autoFocus: Accessor<FocusStrategy | boolean>;
	activeDescendant: Accessor<string | undefined>;
	inputValue: Accessor<string | undefined>;
	triggerMode: Accessor<ComboboxTriggerMode>;
	controlRef: Accessor<HTMLElement | undefined>;
	inputRef: Accessor<HTMLInputElement | undefined>;
	triggerRef: Accessor<HTMLElement | undefined>;
	contentRef: Accessor<HTMLElement | undefined>;
	listboxId: Accessor<string | undefined>;
	triggerAriaLabel: Accessor<string | undefined>;
	listboxAriaLabel: Accessor<string | undefined>;
	listState: Accessor<ListState>;
	keyboardDelegate: Accessor<KeyboardDelegate>;
	resetInputValue: (selectedKeys: Set<string>) => void;
	setIsInputFocused: (isFocused: boolean) => void;
	setInputValue: (value: string) => void;
	setControlRef: (el: HTMLElement) => void;
	setInputRef: (el: HTMLInputElement) => void;
	setTriggerRef: (el: HTMLElement) => void;
	setContentRef: (el: HTMLElement) => void;
	setListboxRef: (el: HTMLElement) => void;
	open: (
		focusStrategy: FocusStrategy | boolean,
		triggerMode?: ComboboxTriggerMode,
	) => void;
	close: () => void;
	toggle: (
		focusStrategy: FocusStrategy | boolean,
		triggerMode?: ComboboxTriggerMode,
	) => void;
	placeholder: Accessor<JSX.Element>;
	renderItem: (item: CollectionNode) => JSX.Element;
	renderSection: (section: CollectionNode) => JSX.Element;
	removeOptionFromSelection: (option: any) => void;
	onInputKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>;
	generateId: (part: string) => string;
	registerListboxId: (id: string) => () => void;
}

export const ComboboxContext = createContext<ComboboxContextValue>();

export function useComboboxContext() {
	const context = useContext(ComboboxContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useComboboxContext` must be used within a `Combobox` component",
		);
	}

	return context;
}
