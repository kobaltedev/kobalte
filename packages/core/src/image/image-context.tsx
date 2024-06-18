import { type Accessor, createContext, useContext } from "solid-js";

import type { ImageLoadingStatus } from "./types";

export interface ImageContextValue {
	fallbackDelay: Accessor<number | undefined>;
	imageLoadingStatus: Accessor<ImageLoadingStatus>;
	onImageLoadingStatusChange: (status: ImageLoadingStatus) => void;
}

export const ImageContext = createContext<ImageContextValue>();

export function useImageContext() {
	const context = useContext(ImageContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useImageContext` must be used within an `Image.Root` component",
		);
	}

	return context;
}
