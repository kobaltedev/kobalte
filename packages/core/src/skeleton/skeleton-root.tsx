/*
 * Portions of this file are based on code from Mantine.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantine team:
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-core/src/components/Skeleton/Skeleton.tsx
 */
import { mergeDefaultProps } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type JSX,
	type ValidComponent,
	createUniqueId,
	splitProps,
} from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface SkeletonRootOptions {
	/** Whether the skeleton is visible. Sets data attribute. */
	visible?: boolean;

	/** Width of skeleton in `px`. Defaults to `100%` */
	width?: number;

	/** Height of skeleton in `px`. Defaults to `auto` */
	height?: number;

	/** Whether skeleton should be a circle. Sets `border-radius` and `width` to `height`. */
	circle?: boolean;

	/** Roundedness of skeleton in `px`. */
	radius?: number;

	/** Whether the skeleton should animate. */
	animate?: boolean;
}

export interface SkeletonRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	style: JSX.CSSProperties | string;
}

export interface SkeletonRootRenderProps extends SkeletonRootCommonProps {
	role: "group";
	"data-animate": boolean | undefined;
	"data-visible": boolean | undefined;
}

export type SkeletonRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SkeletonRootOptions & Partial<SkeletonRootCommonProps<ElementOf<T>>>;

export function Skeleton<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SkeletonRootProps<T>>,
) {
	const defaultId = `skeleton-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			visible: true,
			animate: true,
			id: defaultId,
		},
		props as SkeletonRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"style",
		"radius",
		"animate",
		"height",
		"width",
		"visible",
		"circle",
	]);

	return (
		<Polymorphic<SkeletonRootRenderProps>
			as="div"
			role="group"
			data-animate={local.animate || undefined}
			data-visible={local.visible || undefined}
			style={combineStyle(
				{
					"border-radius": local.circle
						? "9999px"
						: local.radius
							? `${local.radius}px`
							: undefined,
					width: local.circle
						? `${local.height}px`
						: local.width
							? `${local.width}px`
							: "100%",
					height: local.height ? `${local.height}px` : "auto",
				},
				local.style,
			)}
			{...others}
		/>
	);
}
