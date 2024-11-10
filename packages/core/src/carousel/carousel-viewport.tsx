import { type ValidComponent, splitProps, JSX } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";

export interface CarouselViewportOptions {}

export interface CarouselViewportCommonProps<T extends HTMLElement = HTMLElement> {
  children: JSX.Element;
}

export interface CarouselViewportRenderProps extends CarouselViewportCommonProps {}

export type CarouselViewportProps<T extends ValidComponent | HTMLElement = HTMLElement> =
  CarouselViewportOptions & Partial<CarouselViewportCommonProps<ElementOf<T>>>;

export function CarouselViewport<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CarouselViewportProps<T>>
) {
  const [local, others] = splitProps(props as CarouselViewportProps, ["children"]);

  return (
    <Polymorphic<CarouselViewportRenderProps>
      as="div"
      //class="embla__viewport"
      {...others}
    >
      {local.children}
    </Polymorphic>
  );
}
