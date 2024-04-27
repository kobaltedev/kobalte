import { OverrideComponentProps, focusWithoutScrolling } from "@kobalte/utils";
import { Component, ValidComponent, splitProps } from "solid-js";

import {
	MenuContent,
	MenuContentCommonProps,
	MenuContentOptions,
	MenuContentRenderProps,
} from "../menu";
import { useMenuContext } from "../menu/menu-context";
import { useMenuRootContext } from "../menu/menu-root-context";
import { PolymorphicProps } from "../polymorphic";
import { InteractOutsideEvent } from "../primitives";

export interface DropdownMenuContentOptions extends MenuContentOptions {}

export interface DropdownMenuContentCommonProps
	extends MenuContentCommonProps {}

export interface DropdownMenuContentRenderProps
	extends DropdownMenuContentCommonProps,
		MenuContentRenderProps {}

export type DropdownMenuContentProps = DropdownMenuContentOptions &
	Partial<DropdownMenuContentCommonProps>;

/**
 * Contains the content to be rendered when the dropdown menu is open.
 */
export function DropdownMenuContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DropdownMenuContentProps>,
) {
	const rootContext = useMenuRootContext();
	const context = useMenuContext();

	const [local, others] = splitProps(props, [
		"onCloseAutoFocus",
		"onInteractOutside",
	]);

	let hasInteractedOutside = false;

	const onCloseAutoFocus = (e: Event) => {
		local.onCloseAutoFocus?.(e);

		if (!hasInteractedOutside) {
			focusWithoutScrolling(context.triggerRef());
		}

		hasInteractedOutside = false;

		// Always prevent autofocus because we either focus manually or want user agent focus
		e.preventDefault();
	};

	const onInteractOutside = (e: InteractOutsideEvent) => {
		local.onInteractOutside?.(e);

		if (!rootContext.isModal() || e.detail.isContextMenu) {
			hasInteractedOutside = true;
		}
	};

	return (
		<MenuContent<
			Component<
				Omit<DropdownMenuContentRenderProps, keyof MenuContentRenderProps>
			>
		>
			onCloseAutoFocus={onCloseAutoFocus}
			onInteractOutside={onInteractOutside}
			{...others}
		/>
	);
}
