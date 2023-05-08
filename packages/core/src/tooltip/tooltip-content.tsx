/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/1b05a8e35cf35f3020484979086d70aefbaf4095/packages/react/tooltip/src/Tooltip.tsx
 */

import { mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { AsChildProp } from "../polymorphic";
import { PopperPositioner } from "../popper";
import { PointerDownOutsideEvent } from "../primitives";
import { useTooltipContext } from "./tooltip-context";

export interface TooltipContentOptions extends AsChildProp {
  /**
   * Event handler called when the escape key is down.
   * It can be prevented by calling `event.preventDefault`.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Event handler called when a pointer event occurs outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface TooltipContentProps extends OverrideComponentProps<"div", TooltipContentOptions> {}

/**
 * Contains the content to be rendered when the tooltip is open.
 */
export function TooltipContent(props: TooltipContentProps) {
  const context = useTooltipContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("content"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "style"]);

  createEffect(() => onCleanup(context.registerContentId(others.id!)));

  return (
    <Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer
          ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
          }, local.ref)}
          role="tooltip"
          disableOutsidePointerEvents={false}
          style={{
            "--kb-tooltip-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
          }}
          onFocusOutside={e => e.preventDefault()}
          onDismiss={() => context.hideTooltip(true)}
          {...context.dataset()}
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
}
