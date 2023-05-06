import {
  PopperArrow as Arrow,
  type PopperArrowOptions as TooltipArrowOptions,
  type PopperArrowProps as TooltipArrowProps,
} from "../popper";
import {
  TooltipContent as Content,
  type TooltipContentOptions,
  type TooltipContentProps,
} from "./tooltip-content";
import { TooltipPortal as Portal, type TooltipPortalProps } from "./tooltip-portal";
import {
  TooltipRoot as Root,
  type TooltipRootOptions,
  type TooltipRootProps,
} from "./tooltip-root";
import { TooltipTrigger as Trigger, type TooltipTriggerProps } from "./tooltip-trigger";

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
