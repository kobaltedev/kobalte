import {
  type Accessor,
  type JSX,
  type Setter,
  createContext,
  useContext,
} from "solid-js";
import { type EmblaCarouselType } from "embla-carousel";

export interface CarouselContextValue {
  emblaApi: Accessor<EmblaCarouselType | undefined>;
  canScrollNext: Accessor<boolean>;
  canScrollPrev: Accessor<boolean>;
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number) => void;
  selectedIndex: Accessor<number>;
  scrollSnaps: Accessor<number[]>;
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
