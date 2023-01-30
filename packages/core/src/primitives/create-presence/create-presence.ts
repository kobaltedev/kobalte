/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/presence/src/Presence.tsx
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/presence/src/useStateMachine.tsx
 */

import { Accessor, createEffect, createSignal, on, onCleanup } from "solid-js";

export interface CreatePresenceResult {
  isPresent: Accessor<boolean>;
  setRef: (el: HTMLElement) => void;
}

export function createPresence(present: Accessor<boolean>): CreatePresenceResult {
  const [node, setNode] = createSignal<HTMLElement>();

  let styles = {} as CSSStyleDeclaration;
  let prevPresent = present();
  let prevAnimationName = "none";

  const [state, send] = createStateMachine(present() ? "mounted" : "unmounted", {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended",
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted",
    },
    unmounted: {
      MOUNT: "mounted",
    },
  });

  createEffect(
    on(state, state => {
      const currentAnimationName = getAnimationName(styles);
      prevAnimationName = state === "mounted" ? currentAnimationName : "none";
    })
  );

  createEffect(
    on(present, present => {
      if (prevPresent === present) {
        return;
      }

      const currentAnimationName = getAnimationName(styles);

      if (present) {
        send("MOUNT");
        //} else if (currentAnimationName === "none" || styles?.display === "none") {
        // If there is no exit animation or the element is hidden, animations won't run, so we unmount instantly
      } else if (styles?.display === "none") {
        // If the element is hidden, animations won't run, so we unmount instantly
        send("UNMOUNT");
      } else {
        /**
         * When `present` changes to `false`, we check changes to animation-name to
         * determine whether an animation has started. We chose this approach (reading
         * computed styles) because there is no `animationrun` event and `animationstart`
         * fires after `animation-delay` has expired which would be too late.
         */
        const isAnimating = prevAnimationName !== currentAnimationName;

        if (prevPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }

      prevPresent = present;
    })
  );

  createEffect(
    on(node, node => {
      if (node) {
        /**
         * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
         * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
         * make sure we only trigger ANIMATION_END for the currently active animation.
         */
        const handleAnimationEnd = (event: AnimationEvent) => {
          const currentAnimationName = getAnimationName(styles);
          const isCurrentAnimation = currentAnimationName.includes(event.animationName);

          if (event.target === node && isCurrentAnimation) {
            send("ANIMATION_END");
          }
        };

        const handleAnimationStart = (event: AnimationEvent) => {
          if (event.target === node) {
            // if animation occurred, store its name as the previous animation.
            prevAnimationName = getAnimationName(styles);
          }
        };

        node.addEventListener("animationstart", handleAnimationStart);
        node.addEventListener("animationcancel", handleAnimationEnd);
        node.addEventListener("animationend", handleAnimationEnd);

        onCleanup(() => {
          node.removeEventListener("animationstart", handleAnimationStart);
          node.removeEventListener("animationcancel", handleAnimationEnd);
          node.removeEventListener("animationend", handleAnimationEnd);
        });
      } else {
        // Transition to the unmounted state if the node is removed prematurely.
        // We avoid doing so during cleanup as the node may change but still exist.
        send("ANIMATION_END");
      }
    })
  );

  return {
    isPresent: () => ["mounted", "unmountSuspended"].includes(state()),
    setRef: (el: HTMLElement) => {
      if (el) {
        styles = getComputedStyle(el);
      }

      setNode(el);
    },
  };
}

/* -----------------------------------------------------------------------------------------------*/

function getAnimationName(styles?: CSSStyleDeclaration) {
  return styles?.animationName || "none";
}

// https://fettblog.eu/typescript-union-to-intersection/
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any
  ? R
  : never;

type Machine<S> = { [k: string]: { [k: string]: S } };
type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;

function createStateMachine<M>(
  initialState: MachineState<M>,
  machine: M & Machine<MachineState<M>>
): [Accessor<MachineState<M>>, (event: MachineEvent<M>) => void] {
  const reduce = (state: MachineState<M>, event: MachineEvent<M>): MachineState<M> => {
    const nextState = (machine[state] as any)[event];
    return nextState ?? state;
  };

  const [state, setState] = createSignal(initialState);

  const send = (event: MachineEvent<M>) => {
    setState(prev => reduce(prev, event));
  };

  return [state, send];
}
