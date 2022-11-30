/*!
 * Portions of this file are based on code from mantinedev.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/8546c580fdcaa9653edc6f4813103349a96cfb09/src/mantine-core/src/Transition/use-transition.ts
 */

import { access, createMediaQuery, MaybeAccessor } from "@kobalte/utils";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  mergeProps,
  on,
  onCleanup,
} from "solid-js";
import { isServer } from "solid-js/web";

import { getTransitionStyles, TransitionPhase } from "./get-transition-styles";
import { TransitionStyles } from "./types";

export interface TransitionOptions {
  /** The transition styles. */
  transition: TransitionStyles;

  /** Transitions duration (in ms). */
  duration?: number;

  /** Exit transition duration (in ms). */
  exitDuration?: number;

  /** Delay before starting transitions (in ms). */
  delay?: number;

  /** Delay before starting the exit transition (in ms). */
  exitDelay?: number;

  /** Transitions timing function. */
  easing?: JSX.CSSProperties["transition-timing-function"];

  /** Exit transition timing function. */
  exitEasing?: JSX.CSSProperties["transition-timing-function"];

  /** A function that will be called when enter transition starts. */
  onBeforeEnter?: () => void;

  /** A function that will be called when enter transition ends. */
  onAfterEnter?: () => void;

  /** A function that will be called when exit transition starts. */
  onBeforeExit?: () => void;

  /** A function that will be called when exit transition ends. */
  onAfterExit?: () => void;
}

export interface TransitionResult {
  /** Whether the element should be kept in the DOM. */
  keepMounted: Accessor<boolean>;

  /** The transition style to apply on the element. */
  style: Accessor<JSX.CSSProperties>;
}

const DEFAULT_DURATION = 250;
const DEFAULT_DELAY = 10;
const DEFAULT_EASING: JSX.CSSProperties["transition-timing-function"] = "ease";

/**
 * Primitive for working with enter/exit transitions.
 *
 * @param shouldMount Whether the component should be mounted.
 * @param options The transition options.
 */
export function createTransition(
  shouldMount: MaybeAccessor<boolean>,
  options: MaybeAccessor<TransitionOptions>
): TransitionResult {
  options = mergeProps(
    {
      duration: DEFAULT_DURATION,
      delay: DEFAULT_DELAY,
      easing: DEFAULT_EASING,
      get exitDuration() {
        return access(options).duration || DEFAULT_DURATION;
      },
      get exitDelay() {
        return access(options).delay || DEFAULT_DELAY;
      },
      get exitEasing() {
        return access(options).easing || DEFAULT_EASING;
      },
    } as TransitionOptions,
    options
  );

  const reduceMotion = createMediaQuery("(prefers-reduced-motion: reduce)");

  const [duration, setDuration] = createSignal(reduceMotion() ? 0 : access(options).duration!);

  const [phase, setPhase] = createSignal<TransitionPhase>(
    access(shouldMount) ? "afterEnter" : "afterExit"
  );

  const [easing, setEasing] = createSignal(access(options).easing!);

  let timeoutId = -1;

  const handleStateChange = (shouldMount: boolean) => {
    const preHandler = shouldMount ? access(options).onBeforeEnter : access(options).onBeforeExit;
    const postHandler = shouldMount ? access(options).onAfterEnter : access(options).onAfterExit;

    setPhase(shouldMount ? "beforeEnter" : "beforeExit");

    window.clearTimeout(timeoutId);

    const newDuration = setDuration(
      reduceMotion() ? 0 : shouldMount ? access(options).duration! : access(options).exitDuration!
    );

    setEasing(shouldMount ? access(options).easing! : access(options).exitEasing!);

    if (newDuration === 0) {
      preHandler?.();
      postHandler?.();
      setPhase(shouldMount ? "afterEnter" : "afterExit");
      return;
    }

    const delay = reduceMotion()
      ? 0
      : shouldMount
      ? access(options).delay!
      : access(options).exitDelay!;

    const preStateTimeoutId = window.setTimeout(() => {
      preHandler?.();
      setPhase(shouldMount ? "enter" : "exit");
    }, delay);

    timeoutId = window.setTimeout(() => {
      window.clearTimeout(preStateTimeoutId);
      postHandler?.();
      setPhase(shouldMount ? "afterEnter" : "afterExit");
    }, delay + newDuration);
  };

  const style = createMemo(() =>
    getTransitionStyles({
      transition: access(options).transition!,
      duration: duration(),
      phase: phase(),
      easing: easing(),
    })
  );

  const keepMounted = createMemo(() => phase() !== "afterExit");

  createEffect(
    on(
      () => access(shouldMount),
      shouldMount => handleStateChange(shouldMount),
      { defer: true }
    )
  );

  onCleanup(() => {
    if (isServer) {
      return;
    }

    window.clearTimeout(timeoutId);
  });

  return { keepMounted, style };
}
