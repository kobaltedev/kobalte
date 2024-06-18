/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/avatar/src/Avatar.tsx
 */

import { OverrideComponentProps } from "@kobalte/utils";
import { type ValidComponent, createSignal, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { ImageContext, type ImageContextValue } from "./image-context";
import type { ImageLoadingStatus } from "./types";

export interface ImageRootOptions {
	/**
	 * The delay (in ms) before displaying the image fallback.
	 * Useful if you notice a flash during loading for delaying rendering,
	 * so it only appears for those with slower internet connections.
	 */
	fallbackDelay?: number;

	/**
	 * A callback providing information about the loading status of the image.
	 * This is useful in case you want to control more precisely what to render as the image is loading.
	 */
	onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

export interface ImageRootCommonProps<T extends HTMLElement = HTMLElement> {}

export interface ImageRootRenderProps extends ImageRootCommonProps {}

export type ImageRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ImageRootOptions & Partial<ImageRootCommonProps<ElementOf<T>>>;

/**
 * An image element with an optional fallback for loading and error status.
 */
export function ImageRoot<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ImageRootProps<T>>,
) {
	const [local, others] = splitProps(props as ImageRootProps, [
		"fallbackDelay",
		"onLoadingStatusChange",
	]);

	const [imageLoadingStatus, setImageLoadingStatus] =
		createSignal<ImageLoadingStatus>("idle");

	const context: ImageContextValue = {
		fallbackDelay: () => local.fallbackDelay,
		imageLoadingStatus,
		onImageLoadingStatusChange: (status) => {
			setImageLoadingStatus(status);
			local.onLoadingStatusChange?.(status);
		},
	};

	return (
		<ImageContext.Provider value={context}>
			<Polymorphic<ImageRootRenderProps> as="span" {...others} />
		</ImageContext.Provider>
	);
}
