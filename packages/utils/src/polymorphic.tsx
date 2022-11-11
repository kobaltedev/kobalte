import { Component, ComponentProps, JSX, ParentProps } from "solid-js";

import { ClassProp, ElementType, OverrideProps } from "./types";

/** The `as` prop type. */
export type As<Props = any> = ElementType<Props>;

/** Props object that includes the `as` prop. */
export type PolymorphicProps<Type extends As = As, Props = {}> = OverrideProps<
  ComponentProps<Type>,
  ParentProps<Props & ClassProp & { as?: Type }>
>;

/** A component with the `as` prop. */
export type PolymorphicComponent<DefaultType extends As, Props = {}> = {
  <Type extends As>(props: PolymorphicProps<Type, Props> & { as: Type }): JSX.Element;
  (props: PolymorphicProps<DefaultType, Props>): JSX.Element;
};

/** Create a polymorphic component with the `as` prop support. */
export function createPolymorphicComponent<DefaultType extends As, Props = {}, Composite = {}>(
  component: Component<PolymorphicProps<DefaultType, Props>>
) {
  return component as unknown as PolymorphicComponent<DefaultType, Props> & Composite;
}
