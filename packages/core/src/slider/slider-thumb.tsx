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

import { callHandler, mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import {
  Accessor,
  createContext,
  createUniqueId,
  JSX,
  onMount,
  splitProps,
  useContext,
} from "solid-js";

import { createFormControlField, FORM_CONTROL_FIELD_PROP_NAMES } from "../form-control";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { CollectionItemWithRef } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { useSliderContext } from "./slider-context";

export interface SliderThumbProps extends OverrideComponentProps<"span", AsChildProp> {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export function SliderThumb(props: SliderThumbProps) {
  let ref: HTMLElement | undefined;

  const context = useSliderContext();

  props = mergeDefaultProps(
    {
      id: context.generateId(`thumb-${createUniqueId()}`),
    },
    props,
  );

  const [local, formControlFieldProps, others] = splitProps(
    props,
    [
      "ref",
      "style",
      "onKeyDown",
      "onPointerDown",
      "onPointerMove",
      "onPointerUp",
      "onFocus",
      "onBlur",
    ],
    FORM_CONTROL_FIELD_PROP_NAMES,
  );

  const { fieldProps } = createFormControlField(formControlFieldProps);

  createDomCollectionItem<CollectionItemWithRef>({
    getItem: () => ({
      ref: () => ref,
      disabled: context.state.isDisabled(),
      key: fieldProps.id()!,
      textValue: "",
      type: "item",
    }),
  });

  const index = () => (ref ? context.thumbs().findIndex(v => v.ref() === ref) : -1);
  const value = () => context.state.getThumbValue(index()) as number | undefined;

  const position = () => {
    return context.state.getThumbPercent(index());
  };

  const transform = () => {
    /*
    let value = 50;
    const isVertical = context.state.orientation() === "vertical";

    if (isVertical) {
      value *= context.isSlidingFromBottom() ? 1 : -1;
    } else {
      value *= context.isSlidingFromLeft() ? -1 : 1;
    }

    return isVertical ? `translate(-50%, ${value}%)` : `translate(${value}%, -50%)`;
     */

    return context.state.orientation() === "vertical" ? "translateY(50%)" : "translateX(-50%)";
  };

  let startPosition = 0;

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);
    context.onStepKeyDown(e, index());
  };

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    const target = e.currentTarget as HTMLElement;

    e.preventDefault();
    e.stopPropagation();
    target.setPointerCapture(e.pointerId);
    target.focus();

    startPosition = context.state.orientation() === "horizontal" ? e.clientX : e.clientY;

    if (value() !== undefined) {
      context.onSlideStart?.(index(), value()!);
    }
  };

  const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    e.stopPropagation();
    callHandler(e, local.onPointerMove);

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

  const onPointerUp: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    e.stopPropagation();
    callHandler(e, local.onPointerUp);

    const target = e.currentTarget as HTMLElement;

    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
      context.onSlideEnd?.();
    }
  };

  const onFocus: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onFocus);
    context.state.setFocusedThumb(index());
  };

  const onBlur: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onBlur);
    context.state.setFocusedThumb(undefined);
  };

  onMount(() => {
    context.state.setThumbEditable(index(), !context.state.isDisabled());
  });

  return (
    <ThumbContext.Provider value={{ index }}>
      <Polymorphic
        as="span"
        ref={mergeRefs(el => (ref = el), local.ref)}
        role="slider"
        id={fieldProps.id()}
        tabIndex={context.state.isDisabled() ? undefined : 0}
        style={{
          display: value() === undefined ? "none" : undefined,
          position: "absolute",
          [context.startEdge()]: `calc(${position() * 100}%)`,
          transform: transform(),
          "touch-action": "none",
          ...local.style,
        }}
        aria-valuetext={context.state.getThumbValueLabel(index())}
        aria-valuemin={context.minValue()}
        aria-valuenow={value()}
        aria-valuemax={context.maxValue()}
        aria-orientation={context.state.orientation()}
        aria-label={fieldProps.ariaLabel()}
        aria-labelledby={fieldProps.ariaLabelledBy()}
        aria-describedby={fieldProps.ariaDescribedBy()}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onFocus={onFocus}
        onBlur={onBlur}
        {...context.dataset()}
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
