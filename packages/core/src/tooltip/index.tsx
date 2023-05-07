import {
  PopperArrow as Arrow,
  type PopperArrowOptions as TooltipArrowOptions,
  type PopperArrowProps as TooltipArrowProps,
} from "../popper/index.jsx";
import {
  TooltipContent as Content,
  type TooltipContentOptions,
  type TooltipContentProps,
} from "./tooltip-content.jsx";
import { TooltipPortal as Portal, type TooltipPortalProps } from "./tooltip-portal.jsx";
import {
  TooltipRoot as Root,
  type TooltipRootOptions,
  type TooltipRootProps,
} from "./tooltip-root.jsx";
import { TooltipTrigger as Trigger, type TooltipTriggerProps } from "./tooltip-trigger.jsx";

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
