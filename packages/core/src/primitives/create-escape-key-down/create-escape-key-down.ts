import {
	EventKey,
	type MaybeAccessor,
	access,
	getDocument,
} from "@kobalte/utils";
import { type Accessor, createEffect } from "solid-js";
import { isServer } from "@solidjs/web";

export interface CreateEscapeKeyDownProps {
	/** Whether the escape key down events should be listened or not. */
	isDisabled?: MaybeAccessor<boolean | undefined>;

	/** The owner document to attach listeners to. */
	ownerDocument?: Accessor<Document>;

	/** Event handler called when the escape key is down. */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
}

/**
 * Listens for when the escape key is down on the document.
 */
export function createEscapeKeyDown(props: CreateEscapeKeyDownProps) {
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === EventKey.Escape) {
			props.onEscapeKeyDown?.(event);
		}
	};

	createEffect(
		() => ({
			disabled: isServer || !!access(props.isDisabled),
			document: props.ownerDocument?.() ?? getDocument(),
		}),
		({ disabled, document }) => {
			if (disabled) return;
			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		},
	);
}
