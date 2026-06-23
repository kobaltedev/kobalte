import { composeEventHandlers } from "@kobalte/utils";
import { type JSX, type ValidComponent } from "@solidjs/web";
import {
	type Component,
	omit,
} from "solid-js";
import * as Button from "../button";

import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";

export interface PaginationPreviousOptions {}

export interface PaginationPreviousCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface PaginationPreviousRenderProps
	extends PaginationPreviousCommonProps,
		Button.ButtonRootRenderProps {}

export type PaginationPreviousProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PaginationPreviousOptions &
	Partial<PaginationPreviousCommonProps<ElementOf<T>>>;

export function PaginationPrevious<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, PaginationPreviousProps<T>>,
) {
	const context = usePaginationContext();

	const others = omit(props as PaginationPreviousProps, "onClick");

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
		context.setPage(context.page() - 1);
	};

	const isDisabled = () => context.page() === 1;

	return (
		<li>
			<Button.Root<
				Component<
					Omit<
						PaginationPreviousRenderProps,
						keyof Button.ButtonRootRenderProps
					>
				>
			>
				tabindex={isDisabled() || context.page() === 1 ? -1 : undefined}
				disabled={isDisabled()}
				aria-disabled={isDisabled() ? "true" : undefined}
				data-disabled={isDisabled() ? "" : undefined}
				onClick={composeEventHandlers([props.onClick, onClick])}
				{...others}
			/>
		</li>
	);
}
