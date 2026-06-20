import {
	composeEventHandlers,
	mergeRefs,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type ComponentProps,
	type JSX,
	type ValidComponent,
	omit,
} from "solid-js";
import { useFormControlContext } from "../form-control";
import { useFileFieldContext } from "./file-field-context";

export interface FileFieldHiddenInputProps extends ComponentProps<"input"> {}

export function FileFieldHiddenInput<T extends ValidComponent = "input">(
	props: FileFieldHiddenInputProps,
) {
	const others = omit(props, "style", "ref", "onChange");

	const context = useFileFieldContext();
	const formControlContext = useFormControlContext();

	const onChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
		if (context.disabled()) {
			return;
		}

		const { files } = event.currentTarget;
		context.processFiles(Array.from(files ?? []));
	};

	return (
		<input
			type="file"
			id={context.inputId()}
			accept={context.accept()}
			multiple={context.multiple()}
			ref={mergeRefs(context.setFileInputRef, props.ref)}
			style={combineStyle({ ...visuallyHiddenStyles }, props.style)}
			onChange={composeEventHandlers([props.onChange, onChange])}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readOnly={formControlContext.isReadOnly()}
			{...others}
		/>
	);
}
