import {
	type Accessor,
	type JSX,
	type Setter,
	createContext,
	useContext,
} from "solid-js";

import type { ListState } from "../list";
import type { CollectionNode } from "../primitives";
import type { FocusStrategy, KeyboardDelegate } from "../selection";

export interface SelectDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export interface SelectContextValue {
	dataset: Accessor<SelectDataSet>;
	isOpen: Accessor<boolean>;
	isDisabled: Accessor<boolean>;
	isMultiple: Accessor<boolean>;
	isVirtualized: Accessor<boolean>;
	isModal: Accessor<boolean>;
	preventScroll: Accessor<boolean>;
	disallowTypeAhead: Accessor<boolean>;
	shouldFocusWrap: Accessor<boolean>;
	selectedOptions: Accessor<any[]>;
	contentPresent: Accessor<boolean>;
	autoFocus: Accessor<FocusStrategy | boolean>;
	triggerRef: Accessor<HTMLElement | undefined>;
	triggerId: Accessor<string | undefined>;
	valueId: Accessor<string | undefined>;
	listboxId: Accessor<string | undefined>;
	listboxAriaLabelledBy: Accessor<string | undefined>;
	listState: Accessor<ListState>;
	keyboardDelegate: Accessor<KeyboardDelegate>;
	setListboxAriaLabelledBy: Setter<string | undefined>;
	setTriggerRef: (el: HTMLElement) => void;
	setContentRef: (el: HTMLElement) => void;
	setListboxRef: (el: HTMLElement) => void;
	open: (focusStrategy: FocusStrategy | boolean) => void;
	close: () => void;
	toggle: (focusStrategy: FocusStrategy | boolean) => void;
	placeholder: Accessor<JSX.Element>;
	renderItem: (item: CollectionNode) => JSX.Element;
	renderSection: (section: CollectionNode) => JSX.Element;
	removeOptionFromSelection: (option: any) => void;
	generateId: (part: string) => string;
	registerTriggerId: (id: string) => () => void;
	registerValueId: (id: string) => () => void;
	registerListboxId: (id: string) => () => void;
}

export const SelectContext = createContext<SelectContextValue>();

export function useSelectContext() {
	const context = useContext(SelectContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useSelectContext` must be used within a `Select` component",
		);
	}

	return context;
}
