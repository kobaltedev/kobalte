import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";
import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useSignaturePadContext } from "./signature-pad-provider";

export interface SignaturePadClearTriggerOptions {
	children?: JSX.Element;
}

export interface SignaturePadClearTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id?: string;
	style?: JSX.CSSProperties | string;
	"aria-label"?: string;
	onClick?: JSX.EventHandlerUnion<T, MouseEvent>;
	hidden?: boolean;
}

export interface SignaturePadClearTriggerRenderProps
	extends SignaturePadClearTriggerCommonProps,
		Button.ButtonRootRenderProps {}

export type SignaturePadClearTriggerRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SignaturePadClearTriggerOptions &
	Partial<SignaturePadClearTriggerCommonProps<ElementOf<T>>>;

export function SignaturePadClearTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, SignaturePadClearTriggerRootProps<T>>,
) {
	const context = useSignaturePadContext();

	const [local, others] = splitProps(
		props as SignaturePadClearTriggerRootProps,
		["aria-label"],
	);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = () => {
		context.clearDrawing();
	};

	return (
		<Button.Root<
			Component<
				Omit<
					SignaturePadClearTriggerRenderProps,
					keyof Button.ButtonRootRenderProps
				>
			>
		>
			aria-label={local["aria-label"]}
			disabled={!!context.disabled}
			data-part="signature-pad-clear-trigger"
			hidden={!context.allPaths().length || context.isActiveDrawing()}
			onClick={onClick}
			{...(props as SignaturePadClearTriggerRootProps)}
		/>
	);
}
