/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/slider/src/Slider.tsx
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/slider/src/useSliderThumb.ts
 */

import {
  composeEventHandlers,
  focusWithoutScrolling,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import {
  Accessor,
  createContext,
  createEffect,
  JSX,
  onMount,
  splitProps,
  useContext,
} from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { CollectionItemWithRef } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { useSliderContext } from "./slider-context";

export interface SliderThumbProps extends OverrideComponentProps<"span", AsChildProp> {
  style?: JSX.CSSProperties;
}

export function SliderThumb(props: SliderThumbProps) {
  let ref: HTMLElement | undefined;
  const context = useSliderContext();

  props = mergeDefaultProps({ id: context.generateId("thumb") }, props);
  const [local, others] = splitProps(props, ["ref", "style"]);

  createDomCollectionItem<CollectionItemWithRef>({
    getItem: () => ({
      ref: () => ref,
      isDisabled: context.state.isDisabled(),
      key: others.id!,
      textValue: "",
      type: "item",
    }),
  });
  const index = () => (ref ? context.thumbs().findIndex(v => v.ref() === ref) : -1);
  const value = () => context.state.getThumbValue(index()) as number | undefined;
  const position = () => {
    return context.state.getThumbPercent(index());
  };

  let startPosition = 0;
  onMount(() => {
    context.state.setThumbEditable(index(), !context.state.isDisabled());
  });

  const onThumbDown = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;

    target.setPointerCapture(e.pointerId);
    e.preventDefault();
    startPosition = context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    context.onSlideStart?.(context.state.getThumbValue(index()));
  };
  const onThumbMove = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;

    if (target.hasPointerCapture(e.pointerId)) {
      const delta = {
        deltaX: e.clientX - startPosition,
        deltaY: e.clientY - startPosition,
      };
      context.onSlideMove?.(delta);
      startPosition = context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    }
  };

  const onThumbUp = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
      context.onSlideEnd?.();
    }
  };

  return (
    <ThumbContext.Provider value={{ index: index }}>
      <Polymorphic
        ref={mergeRefs(el => (ref = el), local.ref)}
        fallback="span"
        children={props.children}
        aria-label={others["aria-label"]}
        aria-valuetext={context.state.getThumbValueLabel(index())}
        aria-valuemin={context.minValue()}
        aria-valuenow={value()}
        aria-valuemax={context.maxValue()}
        aria-orientation={context.state.orientation()}
        {...context.dataset()}
        tabIndex={context.state.isDisabled() ? undefined : 0}
        onKeyDown={composeEventHandlers<HTMLSpanElement>([
          props.onKeyDown,
          e => {
            context.onStepKeyDown(e, index());
          },
        ])}
        onPointerDown={composeEventHandlers([props.onPointerDown, onThumbDown])}
        onPointerMove={composeEventHandlers([props.onPointerMove, onThumbMove])}
        onPointerUp={composeEventHandlers([props.onPointerUp, onThumbUp])}
        onFocus={composeEventHandlers([
          props.onFocus,
          () => {
            context.state.setFocusedThumb(index());
          },
        ])}
        onBlur={composeEventHandlers([
          props.onBlur,
          () => {
            context.state.setFocusedThumb(undefined);
          },
        ])}
        style={{
          display: value() === undefined ? "none" : undefined,
          position: "absolute",
          [context.startEdge]: `${position() * 100}%`,
          transform: "translate(-50%, -50%)",
          "touch-action": "none",
          ...local.style,
        }}
        {...others}
      />
    </ThumbContext.Provider>
  );
}

const ThumbContext = createContext<{ index: Accessor<number> }>();

export function useThumbContext() {
  const context = useContext(ThumbContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useThumbContext` must be used within a `Slider.Thumb` component");
  }

  return context;
}
