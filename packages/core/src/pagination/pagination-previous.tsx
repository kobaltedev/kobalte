import { composeEventHandlers } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";
import * as Button from "../button";

import { PolymorphicProps } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";

export interface PaginationPreviousOptions {}

export interface PaginationPreviousCommonProps {
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
}

export interface PaginationPreviousRenderProps
	extends PaginationPreviousCommonProps,
		Button.ButtonRootRenderProps {}

export type PaginationPreviousProps = PaginationPreviousOptions &
	Partial<PaginationPreviousCommonProps>;

export function PaginationPrevious<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, PaginationPreviousProps>,
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
