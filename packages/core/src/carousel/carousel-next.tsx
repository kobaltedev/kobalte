import { composeEventHandlers } from "@kobalte/utils";
import { type Component, type JSX, type ValidComponent, splitProps } from "solid-js";
import * as Button from "../button";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";
import { useCarouselContext } from "./carousel-context";

export interface CarouselNextOptions {}

export interface CarouselNextCommonProps<T extends HTMLElement = HTMLElement> {
  onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface CarouselNextRenderProps
  extends CarouselNextCommonProps,
    Button.ButtonRootRenderProps {}

export type CarouselNextProps<T extends ValidComponent | HTMLElement = HTMLElement> =
  CarouselNextOptions & Partial<CarouselNextCommonProps<ElementOf<T>>>;

export function CarouselNext<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, CarouselNextProps<T>>
) {
  const context = useCarouselContext();
  const [local, others] = splitProps(props as CarouselNextProps, ["onClick"]);

  const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = () => {
    context.scrollNext();
  };

  const isDisabled = () => !context.canScrollNext();

  return (
    <Button.Root<Component<Omit<CarouselNextRenderProps, keyof Button.ButtonRootRenderProps>>>
      disabled={isDisabled()}
      aria-disabled={isDisabled() || undefined}
      data-disabled={isDisabled() ? "" : undefined}
      onClick={composeEventHandlers([local.onClick, onClick])}
      {...others}
    />
  );
}
