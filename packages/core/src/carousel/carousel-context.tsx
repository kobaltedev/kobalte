import { type Accessor, createContext, useContext } from "solid-js";
import type { CreateEmblaCarouselType } from "embla-carousel-solid";
import type { Orientation } from "@kobalte/utils";

export type CarouselApi = CreateEmblaCarouselType[1];

export interface CarouselContextValue {
  isDisabled: Accessor<boolean>;
  orientation: Accessor<Orientation>;
  canScrollPrev: Accessor<boolean>;
  canScrollNext: Accessor<boolean>;
  selectedIndex: Accessor<number>;
  api: Accessor<CarouselApi>;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
}

export const CarouselContext = createContext<CarouselContextValue>();

export function useCarouselContext() {
  const context = useContext(CarouselContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useCarouselContext` must be used within a `Carousel` component"
    );
  }

  return context;
}
