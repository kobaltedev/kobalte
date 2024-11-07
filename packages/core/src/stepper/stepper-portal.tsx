// src/stepper/stepper-portal.tsx
import { type Component, type JSX } from "solid-js";
import { Portal } from "solid-js/web";

export interface StepperPortalProps {
  /** The portal content. */
  children?: JSX.Element;
  /** The element to portal the content into. */
  mountPoint?: HTMLElement;
}

export const StepperPortal: Component<StepperPortalProps> = (props) => {
  return <Portal mount={props.mountPoint}>{props.children}</Portal>;
};
