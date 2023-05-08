/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/b6c7f8cf609db32e64c8d4b28b5e06ebf437a800/packages/ariakit/src/popover/popover-arrow.tsx
 * https://github.com/ariakit/ariakit/blob/a178c2f2dcc6571ba338fd74c79e3b0eab2a27c5/packages/ariakit/src/popover/__popover-arrow-path.ts
 */

import { getWindow, mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, createEffect, createSignal, JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { usePopperContext } from "./popper-context";
import { BasePlacement } from "./utils";

const DEFAULT_SIZE = 30;
const HALF_DEFAULT_SIZE = DEFAULT_SIZE / 2;

const ROTATION_DEG = {
  top: 180,
  right: -90,
  bottom: 0,
  left: 90,
} as const;

export const ARROW_PATH =
  "M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z";

export interface PopperArrowOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /** The size of the arrow. */
  size?: number;
}

export interface PopperArrowProps extends OverrideComponentProps<"div", PopperArrowOptions> {}

/**
 * An optional arrow element to render alongside the popper content.
 * Must be rendered in the popper content.
 */
export function PopperArrow(props: PopperArrowProps) {
  const context = usePopperContext();

  props = mergeDefaultProps(
    {
      size: DEFAULT_SIZE,
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "style", "children", "size"]);

  const dir = () => context.currentPlacement().split("-")[0] as BasePlacement;
  const contentStyle = createComputedStyle(context.contentRef);
  const fill = () => contentStyle()?.getPropertyValue("background-color") || "none";
  const stroke = () => contentStyle()?.getPropertyValue(`border-${dir()}-color`) || "none";
  const borderWidth = () => contentStyle()?.getPropertyValue(`border-${dir()}-width`) || "0px";
  const strokeWidth = () => {
    return parseInt(borderWidth()) * 2 * (DEFAULT_SIZE / local.size!);
  };
  const rotate = () => {
    return `rotate(${ROTATION_DEG[dir()]} ${HALF_DEFAULT_SIZE} ${HALF_DEFAULT_SIZE})`;
  };

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(context.setArrowRef, local.ref)}
      aria-hidden="true"
      style={
        {
          // server side rendering
          position: "absolute",
          "font-size": `${local.size!}px`,
          width: "1em",
          height: "1em",
          "pointer-events": "none",
          fill: fill(),
          stroke: stroke(),
          "stroke-width": strokeWidth(),
          ...local.style,
        } as JSX.CSSProperties
      }
      {...others}
    >
      <svg display="block" viewBox={`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`}>
        <g transform={rotate()}>
          <path fill="none" d={ARROW_PATH} />
          <path stroke="none" d={ARROW_PATH} />
        </g>
      </svg>
    </Polymorphic>
  );
}

function createComputedStyle(element: Accessor<Element | undefined>) {
  const [style, setStyle] = createSignal<CSSStyleDeclaration>();

  createEffect(() => {
    const el = element();
    el && setStyle(getWindow(el).getComputedStyle(el));
  });

  return style;
}
