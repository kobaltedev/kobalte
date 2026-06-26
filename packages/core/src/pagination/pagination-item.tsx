import { composeEventHandlers } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";

import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";

export interface PaginationItemOptions {
	/** The page number of this item. (1-indexed) */
	page: number;
}

export interface PaginationItemCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface PaginationItemRenderProps
	extends PaginationItemCommonProps,
		Button.ButtonRootRenderProps {
	"aria-current": "page" | undefined;
	"data-current": "" | undefined;
}

export type PaginationItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PaginationItemOptions & Partial<PaginationItemCommonProps<ElementOf<T>>>;

export function PaginationItem<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, PaginationItemProps<T>>,
) {
	const context = usePaginationContext();

	const others = omit(props as PaginationItemProps, "page", "onClick");

	const isCurrent = () => {
		return context.page() === props.page;
	};

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
		context.setPage(props.page);
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
				onClick={composeEventHandlers([props.onClick, onClick])}
				{...others}
			/>
		</li>
	);
}
