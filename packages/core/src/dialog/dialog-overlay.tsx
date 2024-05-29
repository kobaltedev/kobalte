import { callHandler, mergeRefs } from "@kobalte/utils";
import { JSX, Show, ValidComponent, splitProps } from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";
import { useDialogContext } from "./dialog-context";

export interface DialogOverlayOptions {}

export interface DialogOverlayCommonProps<T extends HTMLElement = HTMLElement> {
	ref: T | ((el: T) => void);
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	/** The HTML styles attribute (object form only). */
	style: JSX.CSSProperties;
}

export interface DialogOverlayRenderProps extends DialogOverlayCommonProps {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export type DialogOverlayProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DialogOverlayOptions & Partial<DialogOverlayCommonProps<ElementOf<T>>>;

/**
 * A layer that covers the inert portion of the view when the dialog is open.
 */
export function DialogOverlay<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DialogOverlayProps<T>>,
) {
	const context = useDialogContext();

	const [local, others] = splitProps(props as DialogOverlayProps, [
		"ref",
		"style",
		"onPointerDown",
	]);

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerDown);

		// fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
		if (e.target === e.currentTarget) {
			e.preventDefault();
		}
	};

	return (
		<Show when={context.overlayPresence.isPresent()}>
			<Polymorphic<DialogOverlayRenderProps>
				as="div"
				ref={mergeRefs(context.overlayPresence.setRef, local.ref)}
				// We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling.
				style={{ "pointer-events": "auto", ...local.style }}
				data-expanded={context.isOpen() ? "" : undefined}
				data-closed={!context.isOpen() ? "" : undefined}
				onPointerDown={onPointerDown}
				{...others}
			/>
		</Show>
	);
}
