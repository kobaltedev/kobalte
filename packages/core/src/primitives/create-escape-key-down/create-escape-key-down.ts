import {
	EventKey,
	type MaybeAccessor,
	access,
	getDocument,
} from "@kobalte/utils";
import { type Accessor, createEffect, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";

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

	createEffect(() => {
		if (isServer) {
			return;
		}

		if (access(props.isDisabled)) {
			return;
		}

		const document = props.ownerDocument?.() ?? getDocument();

		document.addEventListener("keydown", handleKeyDown);

		onCleanup(() => {
			document.removeEventListener("keydown", handleKeyDown);
		});
	});
}
