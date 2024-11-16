import { type ValidComponent, splitProps } from "solid-js";
import { mergeRefs } from "@kobalte/utils";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useCarouselContext } from "./carousel-context";

export interface CarouselViewportOptions {}

export interface CarouselViewportCommonProps<T extends HTMLElement = HTMLElement> {
  ref: T | ((el: T) => void);
}

export interface CarouselViewportRenderProps extends CarouselViewportCommonProps {
  "data-orientation": string;
}

export type CarouselViewportProps<T extends ValidComponent | HTMLElement = HTMLElement> =
  CarouselViewportOptions & Partial<CarouselViewportCommonProps<ElementOf<T>>>;

/**
 * The viewport that contains the carousel items.
 */
export function CarouselViewport<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CarouselViewportProps<T>>
) {
  const context = useCarouselContext();
  const [local, others] = splitProps(props as CarouselViewportProps, ["ref"]);

  return (
    <Polymorphic<CarouselViewportRenderProps>
      as="div"
      ref={mergeRefs(context.api(), local.ref)}
      data-orientation={context.orientation()}
      {...others}
    />
  );
}
