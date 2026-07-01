import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useSignaturePadContext } from "./signature-pad-provider";
import { getRelativePoint } from "./utils";

export type SignaturePadControlCommonProps<
	T extends HTMLElement = HTMLElement,
> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type SignaturePadControlRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = Partial<SignaturePadControlCommonProps<ElementOf<T>>>;

export function SignaturePadControl<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SignaturePadControlRootProps<T>>,
) {
	const context = useSignaturePadContext();

	return (
		<Polymorphic
			as="div"
			aria-roledescription="signature-pad"
			aria-label="signature-pad"
			data-disabled={context.disabled}
			aria-disabled={context.disabled}
			id={context.controlId}
			ref={(el: HTMLDivElement) => (context.signaturePadRef = el)}
			onPointerDown={(event: PointerEvent) => {
				// prevent if not left click, or modifiers are pressed, or disabled
				if (
					context.disabled ||
					event.button !== 0 ||
					event.altKey ||
					event.ctrlKey ||
					event.metaKey ||
					event.shiftKey
				) {
					return;
				}
				const target = event.currentTarget as HTMLElement;
				if (!target) {
					return;
				}

				const actualTarget = event.composedPath()?.[0] as HTMLElement;
				if (actualTarget?.closest("[data-part=signature-pad-clear-trigger]")) {
					return;
				}

				target.setPointerCapture(event.pointerId);
				const point = { x: event.clientX, y: event.clientY };
				const { offset } = getRelativePoint(point, context.signaturePadRef!);
				context.startDrawing(offset, event.pressure);
			}}
			onPointerMove={(event: PointerEvent) => {
				if (context.disabled || !event.currentTarget) {
					return;
				}

				const target = event.currentTarget as HTMLElement;
				if (target.hasPointerCapture(event.pointerId)) {
					const point = { x: event.clientX, y: event.clientY };
					const { offset } = getRelativePoint(point, context.signaturePadRef!);
					context.continueDrawing(offset, event.pressure);
				}
			}}
			onPointerUp={(event: PointerEvent) => {
				if (context.disabled || !event.currentTarget) {
					return;
				}
				context.endDrawing();
				const target = event.currentTarget as HTMLElement;
				if (target.hasPointerCapture(event.pointerId)) {
					target.releasePointerCapture(event.pointerId);
				}
			}}
			{...props}
		>
			{props.children}
		</Polymorphic>
	);
}
