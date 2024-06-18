import type { ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface PaginationEllipsisOptions {}

export interface PaginationEllipsisCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface PaginationEllipsisRenderProps
	extends PaginationEllipsisCommonProps {}

export type PaginationEllipsisProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PaginationEllipsisOptions &
	Partial<PaginationEllipsisCommonProps<ElementOf<T>>>;

export function PaginationEllipsis<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PaginationEllipsisProps<T>>,
) {
	return (
		<li>
			<Polymorphic<PaginationEllipsisRenderProps>
				as="div"
				{...(props as PaginationEllipsisProps)}
			/>
		</li>
	);
}
