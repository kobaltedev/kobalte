/*!
 * Portions of this file are based on code from sonner.
 * MIT Licensed, Copyright (c) 2023 Emil Kowalski.
 *
 * Credits to the sonner team:
 * https://github.com/emilkowalski/sonner/blob/0d027fd3a41013fada9d8a3ef807bcc87053bde8/src/index.tsx
 */

import { JSX } from "solid-js";

import { ToastConfig, ToastState } from "./types";

let toastsCounter = 0;

const subscribers: Array<(toast: ToastConfig) => void> = [];

function subscribe(subscriber: (toast: ToastConfig) => void) {
  subscribers.push(subscriber);

  return () => {
    const index = subscribers.indexOf(subscriber);
    subscribers.splice(index, 1);
  };
}

function show(render: (state: ToastState) => JSX.Element) {
  const id = toastsCounter++;
  subscribers.forEach(subscriber => subscriber({ id, render }));
}

function dismiss(id: number) {
  subscribers.forEach(subscriber => subscriber({ id, dismiss: true }));
  return id;
}

export const toaster = {
  subscribe,
  show,
  dismiss,
};
