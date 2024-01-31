import {
	EventKey,
	OverrideComponentProps,
	callHandler,
	mergeDefaultProps,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { useCheckboxContext } from "./checkbox-context";

export interface CheckboxControlProps
	extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The element that visually represents a checkbox.
 */
export function CheckboxControl(props: CheckboxControlProps) {
	const formControlContext = useFormControlContext();
	const context = useCheckboxContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("control"),
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, ["onClick", "onKeyDown"]);

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick as typeof onClick);

		context.toggle();
		context.inputRef()?.focus();
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown as typeof onKeyDown);

		if (e.key === EventKey.Space) {
			context.toggle();
			context.inputRef()?.focus();
		}
	};

	return (
		<Polymorphic
			as="div"
			onClick={onClick}
			onKeyDown={onKeyDown}
			{...formControlContext.dataset()}
			{...context.dataset()}
			{...others}
		/>
	);
}
