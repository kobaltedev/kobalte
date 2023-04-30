import {
  PopperArrow as Arrow,
  type PopperArrowOptions as TooltipArrowOptions,
  type PopperArrowProps as TooltipArrowProps,
} from "../popper/index.js";
import {
  TooltipContent as Content,
  type TooltipContentOptions,
  type TooltipContentProps,
} from "./tooltip-content.js";
import { TooltipPortal as Portal, type TooltipPortalProps } from "./tooltip-portal.js";
import {
  TooltipRoot as Root,
  type TooltipRootOptions,
  type TooltipRootProps,
} from "./tooltip-root.js";
import { TooltipTrigger as Trigger, type TooltipTriggerProps } from "./tooltip-trigger.js";

export type {
  TooltipArrowOptions,
  TooltipArrowProps,
  TooltipContentOptions,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipRootOptions,
  TooltipRootProps,
  TooltipTriggerProps,
};

export { Arrow, Content, Portal, Root, Trigger };
