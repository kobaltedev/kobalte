// src/stepper/index.tsx
import {
	StepperIndicator as Indicator,
  type StepperIndicatorOptions as IndicatorOptions,
  type StepperIndicatorProps as IndicatorProps,
} from "./stepper-indicator";

import {
  StepperContent as Content,
  type StepperContentOptions,
  type StepperContentProps,
} from "./stepper-content";

import {
  StepperItem as Item,
  type StepperItemOptions,
  type StepperItemProps,
} from "./stepper-item";

import {
  type StepperListOptions,
  type StepperListProps,
  StepperList as List,
} from "./stepper-list";

import {
  type StepperPortalProps,
  StepperPortal as Portal,
} from "./stepper-portal";

import {
  type StepperRootProps,
  StepperRoot as Root,
} from "./stepper-root";

import {
  type StepperSeparatorOptions,
  type StepperSeparatorProps,
  StepperSeparator as Separator,
} from "./stepper-separator";

import {
  type StepperTriggerOptions,
  type StepperTriggerProps,
  StepperTrigger as Trigger,
} from "./stepper-trigger";

import {
  type StepperCompletedContentOptions,
  type StepperCompletedContentProps,
  StepperCompletedContent as CompletedContent,
} from "./stepper-completed-content";

import {
  type StepperNavigationOptions,
  type StepperNavigationProps,
  StepperNavigation as Navigation,
} from "./stepper-navigation";

export type {
  IndicatorOptions,
  IndicatorProps,
  StepperContentOptions,
  StepperContentProps,
  StepperItemOptions,
  StepperItemProps,
  StepperListOptions,
  StepperListProps,
  StepperPortalProps,
  StepperRootProps,
  StepperSeparatorOptions,
  StepperSeparatorProps,
  StepperTriggerOptions,
  StepperTriggerProps,
  StepperCompletedContentOptions,
  StepperCompletedContentProps,
  StepperNavigationOptions,
  StepperNavigationProps,
};

export {
	Indicator,
  Content,
  Item,
  List,
  Portal,
  Root,
  Separator,
  Trigger,
  CompletedContent,
  Navigation,
};

export const Stepper = Object.assign(Root, {
	Indicator,
  Content,
  Item,
  List,
  Portal,
  Separator,
  Trigger,
  CompletedContent,
  Navigation,
});
