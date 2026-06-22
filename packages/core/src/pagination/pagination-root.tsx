import { mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	type Component,
	type Setter,
	createUniqueId,
	omit,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createControllableSignal } from "../primitives";
import {
	PaginationContext,
	type PaginationContextValue,
} from "./pagination-context";

export interface PaginationRootOptions {
	/** The controlled page number of the pagination. (1-indexed) */
	page?: number;

	/**
	 * The default page number when initially rendered. (1-indexed)
	 * Useful when you do not need to control the page number.
	 */
	defaultPage?: number;

	/** Event handler called when the page number changes. */
	onPageChange?: (page: number) => void;

	/** The number of pages for the pagination. */
	count: number;

	/** The number of siblings to show around the current page item. */
	siblingCount?: number;

	/** Whether to always show the first page item. */
	showFirst?: boolean;

	/** Whether to always show the last page item. */
	showLast?: boolean;

	/**
	 * Whether to always show the same number of items (to avoid content shift).
	 * Special value: "no-ellipsis" does not count the ellipsis as an item (used when ellipsis are disabled).
	 */
	fixedItems?: boolean | "no-ellipsis";

	/** The component to render as an item in the `Pagination.List`. */
	itemComponent: Component<{ page: number }>;

	/** The component to render as an ellipsis item in the `Pagination.List`. */
	ellipsisComponent: () => JSX.Element;

	/** Whether the pagination is disabled. */
	disabled?: boolean;
}

export interface PaginationRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	children: JSX.Element;
}

export interface PaginationRootRenderProps extends PaginationRootCommonProps {
	"data-disabled": "" | undefined;
}

export type PaginationRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PaginationRootOptions & Partial<PaginationRootCommonProps<ElementOf<T>>>;

/**
 * A list of page number that allows users to change the current page.
 */
export function PaginationRoot<T extends ValidComponent = "nav">(
	props: PolymorphicProps<T, PaginationRootProps<T>>,
) {
	const defaultId = `pagination-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as PaginationRootProps,
	);

	const others = omit(mergedProps, "page", "defaultPage", "onPageChange", "count", "siblingCount", "showFirst", "showLast", "fixedItems", "itemComponent", "ellipsisComponent", "disabled", "children");

	const state = createControllableSignal({
		defaultValue: () => mergedProps.defaultPage ?? 1,
		onChange: mergedProps.onPageChange,
		value: () => mergedProps.page,
	});

	const context: PaginationContextValue = {
		count: () => mergedProps.count,
		siblingCount: () => mergedProps.siblingCount ?? 1,
		showFirst: () => mergedProps.showFirst ?? true,
		showLast: () => mergedProps.showLast ?? true,
		fixedItems: () => mergedProps.fixedItems ?? false,
		isDisabled: () => mergedProps.disabled ?? false,
		renderItem: (page) => mergedProps.itemComponent({ page }),
		renderEllipsis: mergedProps.ellipsisComponent,
		page: () => Math.min(state[0]() ?? 1, mergedProps.count),
		setPage: state[1] as Setter<number>,
	};

	return (
		<PaginationContext value={context}>
			<Polymorphic<PaginationRootRenderProps>
				as="nav"
				data-disabled={mergedProps.disabled ? "" : undefined}
				{...others}
			>
				<ul>{mergedProps.children}</ul>
			</Polymorphic>
		</PaginationContext>
	);
}
