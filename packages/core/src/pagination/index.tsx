import {PaginationRoot as Root, type PaginationRootProps, type PaginationRootOptions} from "./pagination-root";
import {
  PaginationPrevious as Previous,
  type PaginationPreviousProps,
  type PaginationPreviousOptions
} from "./pagination-previous";
import {PaginationNext as Next, type PaginationNextProps, type PaginationNextOptions} from "./pagination-next";
import {PaginationItem as Item, type PaginationItemProps, type PaginationItemOptions} from "./pagination-item";
import {PaginationList as List, type PaginationListProps} from "./pagination-list";
import {
  PaginationEllipsis as Ellipsis,
  type PaginationEllipsisProps,
  type PaginationEllipsisOptions
} from "./pagination-ellipsis";

export type {
  PaginationRootProps,
  PaginationRootOptions,
  PaginationPreviousProps,
  PaginationPreviousOptions,
  PaginationNextProps,
  PaginationNextOptions,
  PaginationItemProps,
  PaginationItemOptions,
  PaginationListProps,
  PaginationEllipsisProps,
  PaginationEllipsisOptions
};
export {Root, Previous, Next, Item, List, Ellipsis};
