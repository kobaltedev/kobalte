import { composeEventHandlers } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";
import * as Button from "../button/index.tsx";

import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";
import { usePaginationContext } from "./pagination-context.tsx";

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

	const [local, others] = splitProps(props as PaginationPreviousProps, [
		"onClick",
	]);

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
				tabIndex={isDisabled() || context.page() === 1 ? -1 : undefined}
				disabled={isDisabled()}
				aria-disabled={isDisabled() || undefined}
				data-disabled={isDisabled() ? "" : undefined}
				onClick={composeEventHandlers([local.onClick, onClick])}
				{...others}
			/>
		</li>
	);
}
