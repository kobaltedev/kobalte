import { composeEventHandlers } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";

import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";

export interface PaginationNextOptions {}

export interface PaginationNextCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface PaginationNextRenderProps
	extends PaginationNextCommonProps,
		Button.ButtonRootRenderProps {}

export type PaginationNextProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PaginationNextOptions & Partial<PaginationNextCommonProps<ElementOf<T>>>;

export function PaginationNext<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, PaginationNextProps<T>>,
) {
	const context = usePaginationContext();

	const [local, others] = splitProps(props as PaginationNextProps, ["onClick"]);

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = () => {
		context.setPage(context.page() + 1);
	};

	const isDisabled = () => context.page() === context.count();

	return (
		<li>
			<Button.Root<
				Component<
					Omit<PaginationNextRenderProps, keyof Button.ButtonRootRenderProps>
				>
			>
				tabIndex={
					isDisabled() || context.page() === context.count() ? -1 : undefined
				}
				disabled={isDisabled()}
				aria-disabled={isDisabled() || undefined}
				data-disabled={isDisabled() ? "" : undefined}
				onClick={composeEventHandlers([local.onClick, onClick])}
				{...others}
			/>
		</li>
	);
}
