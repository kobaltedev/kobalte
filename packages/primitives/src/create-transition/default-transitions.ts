/*!
 * Portions of this file are based on code from mantinedev.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/8546c580fdcaa9653edc6f4813103349a96cfb09/src/mantine-core/src/Transition/transitions.ts
 */

import { TransitionName, TransitionStyles } from "./types";

const popIn: TransitionStyles = {
  in: { opacity: 1, transform: "scale(1)" },
  out: { opacity: 0, transform: "scale(0.9) translateY(10px)" },
};

export const DEFAULT_TRANSITIONS: Record<TransitionName, TransitionStyles> = {
  fade: {
    in: { opacity: 1 },
    out: { opacity: 0 },
  },

  scale: {
    in: { opacity: 1, transform: "scale(1)" },
    out: { opacity: 0, transform: "scale(0)" },
    common: { "transform-origin": "top" },
  },

  "scale-y": {
    in: { opacity: 1, transform: "scaleY(1)" },
    out: { opacity: 0, transform: "scaleY(0)" },
    common: { "transform-origin": "top" },
  },

  "scale-x": {
    in: { opacity: 1, transform: "scaleX(1)" },
    out: { opacity: 0, transform: "scaleX(0)" },
    common: { "transform-origin": "left" },
  },

  "skew-up": {
    in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
    out: { opacity: 0, transform: "translateY(-20px) skew(-10deg, -5deg)" },
    common: { "transform-origin": "top" },
  },

  "skew-down": {
    in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
    out: { opacity: 0, transform: "translateY(20px) skew(-10deg, -5deg)" },
    common: { "transform-origin": "bottom" },
  },

  "rotate-left": {
    in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
    out: { opacity: 0, transform: "translateY(20px) rotate(-5deg)" },
    common: { "transform-origin": "bottom" },
  },

  "rotate-right": {
    in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
    out: { opacity: 0, transform: "translateY(20px) rotate(5deg)" },
    common: { "transform-origin": "top" },
  },

  "slide-down": {
    in: { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: "translateY(-100%)" },
    common: { "transform-origin": "top" },
  },

  "slide-up": {
    in: { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: "translateY(100%)" },
    common: { "transform-origin": "bottom" },
  },

  "slide-left": {
    in: { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: "translateX(100%)" },
    common: { "transform-origin": "left" },
  },

  "slide-right": {
    in: { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: "translateX(-100%)" },
    common: { "transform-origin": "right" },
  },

  pop: {
    ...popIn,
    common: { "transform-origin": "center center" },
  },

  "pop-bottom-left": {
    ...popIn,
    common: { "transform-origin": "bottom left" },
  },

  "pop-bottom-right": {
    ...popIn,
    common: { "transform-origin": "bottom right" },
  },

  "pop-top-left": {
    ...popIn,
    out: { opacity: 0, transform: "scale(0.9) translateY(-10px)" },
    common: { "transform-origin": "top left" },
  },

  "pop-top-right": {
    ...popIn,
    out: { opacity: 0, transform: "scale(0.9) translateY(-10px)" },
    common: { "transform-origin": "top right" },
  },
};

export const DEFAULT_TRANSITIONS_NAMES = Object.keys(DEFAULT_TRANSITIONS) as Array<TransitionName>;
