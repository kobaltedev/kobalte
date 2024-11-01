import { mergeRefs } from "@kobalte/utils";
import { type ComponentProps, splitProps } from "solid-js";
import { useFileTriggerContext } from "./file-trigger-context";

export interface FileTriggerInputProps extends ComponentProps<"input"> {
	/**
	 * Specifies what mime type of files are allowed.
	 */
	acceptedFileTypes?: string[];
	/**
	 * Whether multiple files can be selected.
	 */
	allowsMultiple?: boolean;
	/**
	 * Specifies the use of a media capture mechanism to capture the media on the spot.
	 */
	defaultCamera?: "user" | "environment";
	/**
	 * Enables the selection of directories instead of individual files.
	 */
	acceptDirectory?: boolean;
}

export function FileTriggerInput(props: FileTriggerInputProps) {
	const context = useFileTriggerContext();

	const [local, others] = splitProps(props, [
		"ref",
		"acceptedFileTypes",
		"allowsMultiple",
		"defaultCamera",
		"acceptDirectory",
	]);

	return (
		<input
			ref={mergeRefs(context.setInputRef, local.ref)}
			type="file"
			style={{ display: "none" }}
			accept={local.acceptedFileTypes?.toString()}
			capture={local.defaultCamera}
			multiple={local.allowsMultiple}
			//@ts-expect-error
			webkitDirectory={local.acceptDirectory ? "" : undefined}
			onChange={e => context.onSelect?.(e.target.files)}
			{...others}
		/>
	);
}
