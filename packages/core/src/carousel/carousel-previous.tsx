import { type ValidComponent, splitProps } from "solid-js";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";
import { useCarouselContext } from "./carousel-context";
import { Button } from "../button";

export interface CarouselPreviousOptions {}

export interface CarouselPreviousCommonProps<T extends HTMLElement = HTMLElement> {
  ref?: T | ((el: T) => void);
}

export type CarouselPreviousProps<T extends ValidComponent | HTMLElement = HTMLElement> = 
  CarouselPreviousOptions & Partial<CarouselPreviousCommonProps<ElementOf<T>>>;

/**
 * Button that navigates to the previous slide in the carousel.
 */
export function CarouselPrevious<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, CarouselPreviousProps<T>>
) {
  const context = useCarouselContext();
  const [local, others] = splitProps(props as CarouselPreviousProps, ["ref"]);

  return (
    <Button
      ref={local.ref}
      aria-label="Previous slide"
      disabled={!context.canScrollPrev()}
      onClick={() => context.scrollPrev()}
      data-orientation={context.orientation()}
      {...others}
    />
  );
}
