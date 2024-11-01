import { type ValidComponent, createSignal, splitProps } from "solid-js";

import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { FileTriggerContext, type FileTriggerContextValue } from "./file-trigger-context";

export interface FileTriggerRootOptions {
	/**
	 * Handler when a user selects a file.
	 */
	onSelect?: (files: FileList | null) => void;
}

export interface FileTriggerRootCommonProps<T extends HTMLElement = HTMLElement> {}

export interface FileTriggerRootRenderProps extends FileTriggerRootCommonProps {}

export type FileTriggerRootProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	FileTriggerRootOptions & Partial<FileTriggerRootCommonProps<ElementOf<T>>>;

export function FileTriggerRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FileTriggerRootProps<T>>,
) {
	const [local, others] = splitProps(props, ["onSelect"]);

	const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

	const context: FileTriggerContextValue = {
		onSelect: local.onSelect,
		inputRef,
		setInputRef,
	};

	return (
		<FileTriggerContext.Provider value={context}>
			<Polymorphic<FileTriggerRootRenderProps> as="div" {...others} />
		</FileTriggerContext.Provider>
	);
}
