import { mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { usePopperContext } from "./popper-context";

export interface PopperPositionerOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * The wrapper component that positions the popper content relative to the popper anchor.
 */
export function PopperPositioner(props: OverrideComponentProps<"div", PopperPositionerOptions>) {
  const context = usePopperContext();

  const [local, others] = splitProps(props, ["ref", "style"]);

  return (
    <Polymorphic
      fallback="div"
      ref={mergeRefs(context.setPositionerRef, local.ref)}
      data-popper-positioner=""
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        "min-width": "max-content",
        ...local.style,
      }}
      {...others}
    />
  );
}
