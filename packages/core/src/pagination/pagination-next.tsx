import { composeEventHandlers } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";

import * as Button from "../button";
import { PolymorphicProps } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";

export interface PaginationNextOptions {}

export interface PaginationNextCommonProps {
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
}

export interface PaginationNextRenderProps
	extends PaginationNextCommonProps,
		Button.ButtonRootRenderProps {}

export type PaginationNextProps = PaginationNextOptions &
	Partial<PaginationNextCommonProps>;

export function PaginationNext<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, PaginationNextProps>,
) {
	const context = usePaginationContext();

	const [local, others] = splitProps(props as PaginationNextProps, ["onClick"]);

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
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
