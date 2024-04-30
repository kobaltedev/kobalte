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
	PaginationPrevious as Previous,
	type PaginationPreviousCommonProps,
	type PaginationPreviousOptions,
	type PaginationPreviousProps,
	type PaginationPreviousRenderProps,
} from "./pagination-previous";
import {
	PaginationRoot as Root,
	type PaginationRootCommonProps,
	type PaginationRootOptions,
	type PaginationRootProps,
	type PaginationRootRenderProps,
} from "./pagination-root";

export type {
	PaginationEllipsisOptions,
	PaginationEllipsisCommonProps,
	PaginationEllipsisRenderProps,
	PaginationEllipsisProps,
	PaginationItemOptions,
	PaginationItemCommonProps,
	PaginationItemRenderProps,
	PaginationItemProps,
	PaginationItemsProps,
	PaginationNextOptions,
	PaginationNextCommonProps,
	PaginationNextRenderProps,
	PaginationNextProps,
	PaginationPreviousOptions,
	PaginationPreviousCommonProps,
	PaginationPreviousRenderProps,
	PaginationPreviousProps,
	PaginationRootOptions,
	PaginationRootCommonProps,
	PaginationRootRenderProps,
	PaginationRootProps,
};
export { Ellipsis, Item, Items, Next, Previous, Root };

export const Pagination = Object.assign(Root, {
	Ellipsis,
	Item,
	Items,
	Next,
	Previous,
});
