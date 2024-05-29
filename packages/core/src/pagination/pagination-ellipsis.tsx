import { ValidComponent } from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";

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
