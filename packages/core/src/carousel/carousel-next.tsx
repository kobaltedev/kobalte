import { type ValidComponent, splitProps } from "solid-js";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";
import { useCarouselContext } from "./carousel-context";
import { Button } from "../button";

export interface CarouselNextOptions {}

export interface CarouselNextCommonProps<T extends HTMLElement = HTMLElement> {
  ref?: T | ((el: T) => void);
}

export type CarouselNextProps<T extends ValidComponent | HTMLElement = HTMLElement> =
  CarouselNextOptions & Partial<CarouselNextCommonProps<ElementOf<T>>>;

/**
 * Button that navigates to the next slide in the carousel.
 */
export function CarouselNext<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, CarouselNextProps<T>>
) {
  const context = useCarouselContext();
  const [local, others] = splitProps(props as CarouselNextProps, ["ref"]);

  return (
    <Button
      ref={local.ref}
      aria-label="Next slide"
      disabled={!context.canScrollNext()}
      onClick={() => context.scrollNext()}
      data-orientation={context.orientation()}
      {...others}
    />
  );
}
