import { createContext, useContext } from "solid-js";

import { CollectionItem } from "./types";

export interface CollectionContextValue<T extends CollectionItem = CollectionItem> {
  registerItem: (item: T) => () => void;
}

export const CollectionContext = createContext<CollectionContextValue>();

export function useCollectionContext<T extends CollectionItem = CollectionItem>() {
  const context = useContext(CollectionContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useCollectionContext` must be used within a `Collection` component"
    );
  }

  return context as CollectionContextValue<T>;
}
