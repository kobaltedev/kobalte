import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";

import type { DialogIntlTranslations } from "./dialog.intl";

export interface DialogContextValue {
	translations: Accessor<DialogIntlTranslations>;
	isOpen: Accessor<boolean>;
	modal: Accessor<boolean>;
	preventScroll: Accessor<boolean>;
	contentId: Accessor<string | undefined>;
	titleId: Accessor<string | undefined>;
	descriptionId: Accessor<string | undefined>;
	triggerRef: Accessor<HTMLElement | undefined>;
	overlayRef: Accessor<HTMLElement | undefined>;
	setOverlayRef: Setter<HTMLElement | undefined>;
	contentRef: Accessor<HTMLElement | undefined>;
	setContentRef: Setter<HTMLElement | undefined>;
	overlayPresent: Accessor<boolean>;
	contentPresent: Accessor<boolean>;
	close: () => void;
	toggle: () => void;
	setTriggerRef: Setter<HTMLElement | undefined>;
	generateId: (part: string) => string;
	registerContentId: (id: string) => () => void;
	registerTitleId: (id: string) => () => void;
	registerDescriptionId: (id: string) => () => void;
}

export const DialogContext = createContext<DialogContextValue>();

export function useDialogContext() {
	const context = useContext(DialogContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useDialogContext` must be used within a `Dialog` component",
		);
	}

	return context;
}
