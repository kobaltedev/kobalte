import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import {
	Accessor,
	Component,
	JSX,
	Setter,
	createUniqueId,
	splitProps,
} from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { createControllableSignal } from "../primitives";
import {
	PaginationContext,
	PaginationContextValue,
} from "./pagination-context";

export interface PaginationRootOptions extends AsChildProp {
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

export interface PaginationRootProps
	extends OverrideComponentProps<"nav", PaginationRootOptions> {}

/**
 * A list of page number that allows users to change the current page.
 */
export function PaginationRoot(props: PaginationRootProps) {
	const defaultId = `pagination-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, [
		"page",
		"defaultPage",
		"onPageChange",
		"count",
		"siblingCount",
		"showFirst",
		"showLast",
		"fixedItems",
		"itemComponent",
		"ellipsisComponent",
		"disabled",
		"children",
	]);

	const state = createControllableSignal({
		defaultValue: () => local.defaultPage ?? 1,
		onChange: local.onPageChange,
		value: () => local.page,
	});

	const context: PaginationContextValue = {
		count: () => local.count,
		siblingCount: () => local.siblingCount ?? 1,
		showFirst: () => local.showFirst ?? true,
		showLast: () => local.showLast ?? true,
		fixedItems: () => local.fixedItems ?? false,
		isDisabled: () => local.disabled ?? false,
		renderItem: (page) => local.itemComponent({ page }),
		renderEllipsis: local.ellipsisComponent,
		page: state[0] as Accessor<number>,
		setPage: state[1] as Setter<number>,
	};

	return (
		<PaginationContext.Provider value={context}>
			<Polymorphic
				as="nav"
				data-disabled={local.disabled ? "" : undefined}
				{...others}
			>
				<ul>{local.children}</ul>
			</Polymorphic>
		</PaginationContext.Provider>
	);
}
