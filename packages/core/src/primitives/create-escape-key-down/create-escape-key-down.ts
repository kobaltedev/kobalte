import { access, EventKey, getDocument, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createEffect, onCleanup } from "solid-js";

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
