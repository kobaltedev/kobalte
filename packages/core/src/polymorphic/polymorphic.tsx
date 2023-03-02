/* @refresh reload */
/* eslint-disable solid/reactivity */
/* eslint-disable solid/components-return-once */

/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/b14ac1fff0cdaf45d1ea3e65c28c320ac0f743f2/packages/react/slot/src/Slot.tsx
 */

import { combineProps as baseCombineProps, isArray } from "@kobalte/utils";
import {
  Accessor,
  ComponentProps,
  createMemo,
  For,
  JSX,
  ParentProps,
  Show,
  splitProps,
  ValidComponent,
} from "solid-js";
import { Dynamic, DynamicProps } from "solid-js/web";

/* -------------------------------------------------------------------------------------------------
 * Polymorphic
 * -----------------------------------------------------------------------------------------------*/

export type PolymorphicProps<T extends ValidComponent, P = ComponentProps<T>> = {
  [K in keyof P]: P[K];
} & {
  /** The component to render when `children` doesn't contain any `Slottable` or `As` component as direct child. */
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

  const resolvedChildren = createMemo(() => local.children) as Accessor<any>;

  // Single child is `As`.
  if (isAs(resolvedChildren())) {
    return <Dynamic {...combineProps(others, resolvedChildren()?.props ?? {})} />;
  }

  // Multiple children, find a `Slottable` if any.
  if (isArray(resolvedChildren())) {
    const slottable = resolvedChildren().find(isSlottable);

    if (slottable) {
      // The new element to render may be the one passed as a child of `Slottable`.
      const newElement = slottable.props.children as any;

      // Get the correct content to render depending on if `Slottable` children is `As` or not.
      const newChildren = () => (
        <For each={resolvedChildren()}>
          {(child: any) => (
            <Show when={child === slottable} fallback={child}>
              <Show when={isAs(newElement)} fallback={newElement}>
                {newElement.props.children}
              </Show>
            </Show>
          )}
        </For>
      );

      if (isAs(newElement)) {
        return <Dynamic {...combineProps(others, newElement?.props ?? {})}>{newChildren}</Dynamic>;
      }

      // No `Slottable` containing `As`, render the fallback with the new children.
      return (
        <Dynamic component={local.fallback} {...others}>
          {newChildren}
        </Dynamic>
      );
    }
  }

  // No `As` or `Slottable`, render the fallback with the original children.
  return (
    <Dynamic component={local.fallback} {...others}>
      {resolvedChildren()}
    </Dynamic>
  );
}

/* -------------------------------------------------------------------------------------------------
 * As
 * -----------------------------------------------------------------------------------------------*/

const AS_COMPONENT_SYMBOL = Symbol("$$KobalteAsComponent");

/**
 * A utility component used to delegate rendering of its `Polymorphic` parent component.
 */
export function As<T extends ValidComponent>(props: DynamicProps<T>) {
  return {
    [AS_COMPONENT_SYMBOL]: true,
    props,
  } as unknown as JSX.Element;
}

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

const SLOTTABLE_COMPONENT_SYMBOL = Symbol("$$KobalteSlottableComponent");

/**
 * A utility component used to tell `Polymorphic` where to potentially find an `As` child component.
 * Must be used when `Polymorphic` has more than one child.
 */
export function Slottable(props: ParentProps) {
  return {
    [SLOTTABLE_COMPONENT_SYMBOL]: true,
    props,
  } as unknown as JSX.Element;
}

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

function isAs(component: any): boolean {
  return component?.[AS_COMPONENT_SYMBOL] === true;
}

function isSlottable(component: any): boolean {
  return component?.[SLOTTABLE_COMPONENT_SYMBOL] === true;
}

function combineProps(baseProps: any, overrideProps: any) {
  return baseCombineProps([baseProps, overrideProps], { reverseEventHandlers: true }) as any;
}
