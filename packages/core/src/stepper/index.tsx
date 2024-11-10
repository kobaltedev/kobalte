import {
  StepperContent as Content,
  type StepperContentProps,
  type StepperContentOptions,
  type StepperContentCommonProps,
  type StepperContentRenderProps,
} from "./stepper-content";
import {
  StepperItem as Item,
  type StepperItemProps,
  type StepperItemOptions,
  type StepperItemCommonProps,
  type StepperItemRenderProps,
} from "./stepper-item";
import {
  StepperList as List,
  type StepperListProps,
  type StepperListOptions,
  type StepperListCommonProps,
  type StepperListRenderProps,
} from "./stepper-list";
import {
  StepperNextTrigger as NextTrigger,
  type StepperNextTriggerProps,
  type StepperNextTriggerOptions,
  type StepperNextTriggerCommonProps,
  type StepperNextTriggerRenderProps,
} from "./stepper-next-trigger";
import {
  StepperPrevTrigger as PrevTrigger,
  type StepperPrevTriggerProps,
  type StepperPrevTriggerOptions,
  type StepperPrevTriggerCommonProps,
  type StepperPrevTriggerRenderProps,
} from "./stepper-prev-trigger";
import {
  StepperRoot as Root,
  type StepperRootProps,
  type StepperRootOptions,
  type StepperRootCommonProps,
  type StepperRootRenderProps,
} from "./stepper-root";
import {
  StepperSeparator as Separator,
  type StepperSeparatorProps,
  type StepperSeparatorOptions,
  type StepperSeparatorCommonProps,
  type StepperSeparatorRenderProps,
} from "./stepper-separator";
import {
  StepperTrigger as Trigger,
  type StepperTriggerProps,
  type StepperTriggerOptions,
  type StepperTriggerCommonProps,
  type StepperTriggerRenderProps,
} from "./stepper-trigger";
import {
  StepperCompletedContent as CompletedContent,
  type StepperCompletedContentProps,
  type StepperCompletedContentOptions,
  type StepperCompletedContentCommonProps,
  type StepperCompletedContentRenderProps,
} from "./stepper-completed-content";

export type {
  StepperContentOptions,
  StepperContentCommonProps,
  StepperContentRenderProps,
  StepperContentProps,
  StepperItemOptions,
  StepperItemCommonProps,
  StepperItemRenderProps,
  StepperItemProps,
  StepperListOptions,
  StepperListCommonProps,
  StepperListRenderProps,
  StepperListProps,
  StepperNextTriggerOptions,
  StepperNextTriggerCommonProps,
  StepperNextTriggerRenderProps,
  StepperNextTriggerProps,
  StepperPrevTriggerOptions,
  StepperPrevTriggerCommonProps,
  StepperPrevTriggerRenderProps,
  StepperPrevTriggerProps,
  StepperRootOptions,
  StepperRootCommonProps,
  StepperRootRenderProps,
  StepperRootProps,
  StepperSeparatorOptions,
  StepperSeparatorCommonProps,
  StepperSeparatorRenderProps,
  StepperSeparatorProps,
  StepperTriggerOptions,
  StepperTriggerCommonProps,
  StepperTriggerRenderProps,
  StepperTriggerProps,
  StepperCompletedContentOptions,
  StepperCompletedContentCommonProps,
  StepperCompletedContentRenderProps,
  StepperCompletedContentProps,
};

export {
  Content,
  Item,
  List,
  NextTrigger,
  PrevTrigger,
  Root,
  Separator,
  Trigger,
  CompletedContent,
};

export const Stepper = Object.assign(Root, {
  Content,
  Item,
  List,
  NextTrigger,
  PrevTrigger,
  Separator,
  Trigger,
  CompletedContent,
});
