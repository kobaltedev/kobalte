/* @refresh reload */

import { combineProps } from "@kobalte/utils";
import { Accessor, createMemo, JSX, splitProps, ValidComponent } from "solid-js";
import { Dynamic, DynamicProps } from "solid-js/web";

const AS_COMPONENT_SYMBOL = Symbol("$$KobalteAsComponent");

/**
 * A utility component used to delegate rendering of its parent component.
 */
export function As<T extends ValidComponent>(props: DynamicProps<T>) {
  return {
    [AS_COMPONENT_SYMBOL]: true,
    props,
  } as unknown as JSX.Element;
}

/**
 * A utility component that render either Kobalte's `As` or its `fallbackComponent`.
 */
export function Polymorphic<T extends ValidComponent>(
  props: JSX.HTMLAttributes<HTMLElement> & { fallbackComponent: T }
) {
  const [local, others] = splitProps(props, ["fallbackComponent", "children"]);

  const resolvedChildren: Accessor<any> = createMemo(() => local.children);

  // eslint-disable-next-line solid/reactivity
  if (resolvedChildren()?.[AS_COMPONENT_SYMBOL]) {
    // eslint-disable-next-line solid/components-return-once
    return (
      <Dynamic
        {...combineProps([others, resolvedChildren()?.props as DynamicProps<any>], {
          reverseEventHandlers: true,
        })}
      />
    );
  }

  return (
    <Dynamic component={local.fallbackComponent} {...(others as any)}>
      {resolvedChildren()}
    </Dynamic>
  );
}
