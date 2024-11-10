import { type ValidComponent, Show, splitProps, JSX } from "solid-js";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useStepperContext } from "./stepper-context";

export interface StepperContentOptions {
  /** The index of this content panel */
  index: number;
}

export interface StepperContentCommonProps<T extends HTMLElement = HTMLElement> {
  children?: JSX.Element;
}

export interface StepperContentRenderProps extends StepperContentCommonProps {
  role: string;
  "aria-labelledby"?: string;
  "data-active"?: string;
}

export type StepperContentProps<T extends ValidComponent | HTMLElement = HTMLElement> =
  StepperContentOptions & Partial<StepperContentCommonProps<ElementOf<T>>>;

export function StepperContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, StepperContentProps<T>>
) {
  const context = useStepperContext();
  const [local, others] = splitProps(props as StepperContentProps, ["index", "children"]);

  const isActive = () => context.step() === local.index;

  return (
    <Show when={isActive()}>
      <Polymorphic<StepperContentRenderProps>
        as="div"
        role="tabpanel"
        data-active={isActive() ? "" : undefined}
        {...others}
      >
        {local.children}
      </Polymorphic>
    </Show>
  );
}
