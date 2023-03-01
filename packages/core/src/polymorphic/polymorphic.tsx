/* @refresh reload */
/* eslint-disable solid/components-return-once */
/* eslint-disable solid/reactivity */

import { combineProps as baseCombineProps, isArray } from "@kobalte/utils";
import {
  Accessor,
  children,
  ComponentProps,
  For,
  JSX,
  Show,
  splitProps,
  ValidComponent,
} from "solid-js";
import { Dynamic, DynamicProps } from "solid-js/web";

const AS_COMPONENT_SYMBOL = Symbol("$$KobalteAsComponent");

/* -------------------------------------------------------------------------------------------------
 * As
 * -----------------------------------------------------------------------------------------------*/

/**
 * A utility component used to delegate rendering of its parent component.
 */
export function As<T extends ValidComponent>(props: DynamicProps<T>) {
  return {
    [AS_COMPONENT_SYMBOL]: true,
    props,
  } as unknown as JSX.Element;
}

/* -------------------------------------------------------------------------------------------------
 * Polymorphic
 * -----------------------------------------------------------------------------------------------*/

export type PolymorphicProps<T extends ValidComponent, P = ComponentProps<T>> = {
  [K in keyof P]: P[K];
} & {
  /** The component to render when `children` is not the `As` component. */
  fallback: T;
};

/**
 * A utility component that render either `As` or its `fallback` component.
 */
export function Polymorphic<T extends ValidComponent>(props: PolymorphicProps<T>) {
  const [local, others] = splitProps(props as PolymorphicProps<ValidComponent>, [
    "fallback",
    "children",
  ]);

  const resolvedChildren = children(() => local.children) as Accessor<any>;

  // Single child is `As`.
  if (isAsComponent(resolvedChildren())) {
    return <Dynamic {...combineProps(others, resolvedChildren()?.props ?? {})} />;
  }

  // Multiple children.
  if (isArray(resolvedChildren())) {
    const newElement = resolvedChildren().find(isAsComponent);

    // One of them is `As`.
    if (newElement) {
      return (
        <Dynamic {...combineProps(others, newElement?.props ?? {})}>
          <For each={resolvedChildren()}>
            {(child: any) => (
              <Show when={child === newElement} fallback={child}>
                {child.props.children}
              </Show>
            )}
          </For>
        </Dynamic>
      );
    }
  }

  // No child is `As`.
  return (
    <Dynamic component={local.fallback} {...others}>
      {resolvedChildren()}
    </Dynamic>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

function isAsComponent(component: any): component is typeof As {
  return component?.[AS_COMPONENT_SYMBOL] === true;
}

function combineProps(baseProps: any, overrideProps: any) {
  return baseCombineProps([baseProps, overrideProps], { reverseEventHandlers: true }) as any;
}
