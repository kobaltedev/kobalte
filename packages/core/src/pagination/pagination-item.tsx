import { composeEventHandlers } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";

import * as Button from "../button";
import { PolymorphicProps } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";

export interface PaginationItemOptions {
	/** The page number of this item. (1-indexed) */
	page: number;
}

export interface PaginationItemCommonProps {
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
}

export interface PaginationItemRenderProps
	extends PaginationItemCommonProps,
		Button.ButtonRootRenderProps {
	"aria-current": "page" | undefined;
	"data-current": "" | undefined;
}

export type PaginationItemProps = PaginationItemOptions &
	Partial<PaginationItemCommonProps>;

export function PaginationItem<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, PaginationItemProps>,
) {
	const context = usePaginationContext();

	const [local, others] = splitProps(props as PaginationItemProps, [
		"page",
		"onClick",
	]);

	const isCurrent = () => {
		return context.page() === local.page;
	};

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
		context.setPage(local.page);
	};

	return (
		<li>
			<Button.Root<
				Component<
					Omit<PaginationItemRenderProps, keyof Button.ButtonRootRenderProps>
				>
			>
				aria-current={isCurrent() ? "page" : undefined}
				data-current={isCurrent() ? "" : undefined}
				onClick={composeEventHandlers([local.onClick, onClick])}
				{...others}
			/>
		</li>
	);
}
