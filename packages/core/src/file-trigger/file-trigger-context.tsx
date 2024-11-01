import { type Accessor, createContext, useContext } from "solid-js";

export interface FileTriggerContextValue {
	onSelect?: (files: FileList | null) => void;
	inputRef: Accessor<HTMLInputElement | undefined>;
	setInputRef: (el: HTMLInputElement) => void;
}

export const FileTriggerContext = createContext<FileTriggerContextValue>();

export function useFileTriggerContext() {
	const context = useContext(FileTriggerContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useFileTriggerContext` must be used within a `FileTrigger` component",
		);
	}

	return context;
}
