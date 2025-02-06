import { mergeRefs, visuallyHiddenStyles } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import { type JSX, type ValidComponent, splitProps } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useFileUploadContext } from "./file-upload-root-provider";

export interface FileUploadHiddenInputProps extends ComponentProps<"input"> {}

export function FileUploadHiddenInput<T extends ValidComponent = "input">(
	props: FileUploadHiddenInputProps,
) {
	const [local, others] = splitProps(props as FileUploadHiddenInputRootProps, [
		"style",
		"ref",
		"onChange",
	]);

	const context = useFileUploadContext();

	const onChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
		if (context.disabled) {
			return;
		}

		const { files } = event.currentTarget;
		context.processFiles(Array.from(files ?? []));
	};

	return (
		<input
			type="file"
			id={context.inputId}
			accept={context.accept()}
			multiple={context.multiple()}
			ref={mergeRefs(context.setFileInputRef, local.ref)}
			style={combineStyle({ ...visuallyHiddenStyles }, local.style)}
			onChange={composeEventHandlers([local.onChange, onChange])}
			{...others}
		/>
	);
}
