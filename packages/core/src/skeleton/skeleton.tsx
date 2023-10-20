/*!
 * Portions of this file are based on code from Mantine.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantine team:
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-core/src/components/Skeleton/Skeleton.tsx
 */
import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createUniqueId, JSX, splitProps } from "solid-js";
import { Polymorphic } from "../polymorphic";

interface SkeletonOptions {
  /** Whether the skeleton is visible. Sets data attribute. */
  visible?: boolean;

  /** Width of skeleton in `px`. Defaults to `100%` */
  width?: number;

  /** Height of skeleton in `px`. Defaults to `auto` */
  height?: number;

  /** Whether skeleton should be a circle. Sets `border-radius` and `width` to `height`. */
  circle?: boolean;

  /** Roundedness of skeleton in `px`. */
  radius?: number;

  /** Whether the skeleton should animate. */
  animate?: boolean;

  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface SkeletonProps extends OverrideComponentProps<"div", SkeletonOptions> {}

export function Skeleton(props: SkeletonProps) {
  const defaultId = `skeleton-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      visible: true,
      animate: true,
      id: defaultId,
    },
    props,
  );

  const [local, others] = splitProps(props, [
    "style",
    "ref",
    "radius",
    "animate",
    "height",
    "width",
    "visible",
    "circle",
  ]);

  return (
    <Polymorphic
      as="div"
      role="group"
      data-animate={local.animate}
      data-visible={local.visible}
      style={{
        "border-radius": local.circle ? "9999px" : local.radius ? `${local.radius}px` : undefined,
        width: local.circle ? `${local.height}px` : local.width ? `${local.width}px` : "100%",
        height: local.height ? `${local.height}px` : "auto",
        ...local.style,
      }}
      {...others}
    ></Polymorphic>
  );
}
