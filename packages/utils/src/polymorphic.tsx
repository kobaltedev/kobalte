import { Component, ComponentProps, JSX } from "solid-js";

/** All HTML and SVG elements. */
export type DOMElements = keyof JSX.IntrinsicElements;

/** Any HTML element or SolidJS component. */
export type ElementType<Props = any> = DOMElements | Component<Props>;

/**
 * Allows for extending a set of props (`Source`) by an overriding set of props (`Override`),
 * ensuring that any duplicates are overridden by the overriding set of props.
 */
export type OverrideProps<Source = {}, Override = {}> = Omit<Source, keyof Override> & Override;

/** The `as` prop type. */
export type As<Props = any> = ElementType<Props>;

/** Props object that includes the `as` prop. */
export type PolymorphicProps<Type extends As = As, Props = {}> = OverrideProps<
  ComponentProps<Type>,
  Props & { as?: Type }
>;

/** A component with the `as` prop. */
export type PolymorphicComponent<DefaultType extends As, Props = {}> = {
  <Type extends As>(props: PolymorphicProps<Type, Props> & { as: Type }): JSX.Element;
  (props: PolymorphicProps<DefaultType, Props>): JSX.Element;
};

/**
 * Create a component with the type cast to `PolymorphicComponent`.
 * You have to use `Dynamic` internally and pass the `as` prop to handle polymorphism correctly.
 */
export function createPolymorphicComponent<DefaultType extends As, Props = {}>(
  component: Component<PolymorphicProps<DefaultType, Props>>
) {
  return component as unknown as PolymorphicComponent<DefaultType, Props>;
}
