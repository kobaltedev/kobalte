import { Accessor, createContext, useContext } from "solid-js";

import { ImageLoadingStatus } from "./types";

export interface AvatarContextValue {
  fallbackDelay: Accessor<number | undefined>;
  imageLoadingStatus: Accessor<ImageLoadingStatus>;
  onImageLoadingStatusChange: (status: ImageLoadingStatus) => void;
}

export const AvatarContext = createContext<AvatarContextValue>();

export function useAvatarContext() {
  const context = useContext(AvatarContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useAvatarContext` must be used within an `Avatar.Root` component");
  }

  return context;
}
