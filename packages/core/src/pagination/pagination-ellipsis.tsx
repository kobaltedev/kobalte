import { ValidComponent } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";

export interface PaginationEllipsisOptions {}

export interface PaginationEllipsisCommonProps {}

export interface PaginationEllipsisRenderProps
	extends PaginationEllipsisCommonProps {}

export type PaginationEllipsisProps = PaginationEllipsisOptions &
	Partial<PaginationEllipsisCommonProps>;

export function PaginationEllipsis<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PaginationEllipsisProps>,
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
