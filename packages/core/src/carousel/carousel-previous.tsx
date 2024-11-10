import { composeEventHandlers } from "@kobalte/utils";
import { type Component, type JSX, type ValidComponent, splitProps } from "solid-js";
import * as Button from "../button";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";
import { useCarouselContext } from "./carousel-context";

export interface CarouselPreviousOptions {}

export interface CarouselPreviousCommonProps<T extends HTMLElement = HTMLElement> {
  onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface CarouselPreviousRenderProps
  extends CarouselPreviousCommonProps,
    Button.ButtonRootRenderProps {}

export type CarouselPreviousProps<T extends ValidComponent | HTMLElement = HTMLElement> =
  CarouselPreviousOptions & Partial<CarouselPreviousCommonProps<ElementOf<T>>>;

export function CarouselPrevious<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, CarouselPreviousProps<T>>
) {
  const context = useCarouselContext();
  const [local, others] = splitProps(props as CarouselPreviousProps, ["onClick"]);

  const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = () => {
    context.scrollPrev();
  };

  const isDisabled = () => !context.canScrollPrev();

  return (
    <Button.Root<Component<Omit<CarouselPreviousRenderProps, keyof Button.ButtonRootRenderProps>>>
      disabled={isDisabled()}
      aria-disabled={isDisabled() || undefined}
      data-disabled={isDisabled() ? "" : undefined}
      onClick={composeEventHandlers([local.onClick, onClick])}
      {...others}
    />
  );
}
