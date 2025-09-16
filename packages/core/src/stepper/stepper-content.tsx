import { type ValidComponent, splitProps, JSX } from "solid-js";
import { Tabs } from "../tabs";
import { type ElementOf, type PolymorphicProps } from "../polymorphic";

export interface StepperContentOptions {
  index: number;
}

export interface StepperContentCommonProps<T extends HTMLElement = HTMLElement> {
  children?: JSX.Element;
}

export type StepperContentProps<T extends ValidComponent | HTMLElement = HTMLElement> =
  StepperContentOptions & Partial<StepperContentCommonProps<ElementOf<T>>>;

export function StepperContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, StepperContentProps<T>>
) {
  const [local, others] = splitProps(props as StepperContentProps, ["index", "children"]);

  return (
    <Tabs.Content
      value={local.index.toString()}
      {...others}
    >
      {local.children}
    </Tabs.Content>
  );
}
