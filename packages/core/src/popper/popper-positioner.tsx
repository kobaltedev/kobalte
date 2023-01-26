import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { usePopperContext } from "./popper-context";

export interface PopperPositionerOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * The wrapper component that positions the popper content relative to the popper anchor.
 */
export const PopperPositioner = /*#__PURE__*/ createPolymorphicComponent<
  "div",
  PopperPositionerOptions
>(props => {
  const context = usePopperContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "ref", "style"]);

  return (
    <Dynamic
      component={local.as}
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
});
