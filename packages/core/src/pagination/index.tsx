import {
	PaginationEllipsis as Ellipsis,
	type PaginationEllipsisCommonProps,
	type PaginationEllipsisOptions,
	type PaginationEllipsisProps,
	type PaginationEllipsisRenderProps,
} from "./pagination-ellipsis";
import {
	PaginationItem as Item,
	type PaginationItemCommonProps,
	type PaginationItemOptions,
	type PaginationItemProps,
	type PaginationItemRenderProps,
} from "./pagination-item";
import {
	PaginationItems as Items,
	type PaginationItemsProps,
} from "./pagination-items";
import {
	PaginationNext as Next,
	type PaginationNextCommonProps,
	type PaginationNextOptions,
	type PaginationNextProps,
	type PaginationNextRenderProps,
} from "./pagination-next";
import {
	type PaginationPreviousCommonProps,
	type PaginationPreviousOptions,
	type PaginationPreviousProps,
	type PaginationPreviousRenderProps,
	PaginationPrevious as Previous,
} from "./pagination-previous";
import {
	type PaginationRootCommonProps,
	type PaginationRootOptions,
	type PaginationRootProps,
	type PaginationRootRenderProps,
	PaginationRoot as Root,
} from "./pagination-root";

export type {
	PaginationEllipsisCommonProps,
	PaginationEllipsisOptions,
	PaginationEllipsisProps,
	PaginationEllipsisRenderProps,
	PaginationItemCommonProps,
	PaginationItemOptions,
	PaginationItemProps,
	PaginationItemRenderProps,
	PaginationItemsProps,
	PaginationNextCommonProps,
	PaginationNextOptions,
	PaginationNextProps,
	PaginationNextRenderProps,
	PaginationPreviousCommonProps,
	PaginationPreviousOptions,
	PaginationPreviousProps,
	PaginationPreviousRenderProps,
	PaginationRootCommonProps,
	PaginationRootOptions,
	PaginationRootProps,
	PaginationRootRenderProps,
};
export { Ellipsis, Item, Items, Next, Previous, Root };

export const Pagination = Object.assign(Root, {
	Ellipsis,
	Item,
	Items,
	Next,
	Previous,
});

/**
 * API will most probably change
 */
export {
	type PaginationContextValue,
	usePaginationContext,
} from "./pagination-context";
