import { composeEventHandlers, visuallyHiddenStyles } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { ComponentProps, JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { useFormControlContext } from "../form-control";
import { useFileFieldContext } from "./file-field-context";

export interface FileFieldHiddenInputProps extends ComponentProps<"input"> {}

export function FileFieldHiddenInput(props: FileFieldHiddenInputProps) {
	const others = omit(props, "style", "ref", "onChange");

	const context = useFileFieldContext();
	const formControlContext = useFormControlContext();

	const onChange: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (
		event,
	) => {
		if (context.disabled()) {
			return;
		}

		const { files } = (
			event as InputEvent & { currentTarget: HTMLInputElement }
		).currentTarget;
		context.processFiles(Array.from(files ?? []) as File[]);
	};

	return (
		<input
			type="file"
			id={context.inputId()}
			accept={context.accept()}
			multiple={context.multiple()}
			ref={(el: HTMLInputElement) => {
				context.setFileInputRef(el);
				if (typeof props.ref === "function")
					(props.ref as (el: HTMLInputElement) => void)(el);
			}}
			style={combineStyle(
				{ ...visuallyHiddenStyles },
				props.style || undefined,
			)}
			onChange={composeEventHandlers([props.onChange, onChange])}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			{...others}
		/>
	);
}
