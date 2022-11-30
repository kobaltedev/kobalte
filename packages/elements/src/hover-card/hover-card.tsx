/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard-state.ts
 */

import { mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, ParentComponent, splitProps } from "solid-js";

import { DialogCloseButton } from "../dialog/dialog-close-button";
import { DialogDescription } from "../dialog/dialog-description";
import { DialogPortal } from "../dialog/dialog-portal";
import { DialogTitle } from "../dialog/dialog-title";
import { PopoverProps } from "../popover";
import { PopoverArrow } from "../popover/popover-arrow";
import { PopoverPositioner } from "../popover/popover-positioner";
import { HoverCardTrigger } from "./hover-card-trigger";

type HoverCardComposite = {
  Trigger: typeof HoverCardTrigger;
  //Panel: typeof HoverCardPanel;

  Positioner: typeof PopoverPositioner;
  Arrow: typeof PopoverArrow;

  Portal: typeof DialogPortal;
  CloseButton: typeof DialogCloseButton;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
};

export interface HoverCardProps extends PopoverProps {}

/**
 * A popover that allows sighted users to preview content available behind a link.
 */
export const HoverCard: ParentComponent<HoverCardProps> & HoverCardComposite = props => {
  const defaultId = `kb-hovercard-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, []);

  return <></>;
};

HoverCard.Trigger = HoverCardTrigger;
//HoverCard.Panel = HoverCardPanel;

HoverCard.Positioner = PopoverPositioner;
HoverCard.Arrow = PopoverArrow;

HoverCard.Portal = DialogPortal;
HoverCard.CloseButton = DialogCloseButton;
HoverCard.Title = DialogTitle;
HoverCard.Description = DialogDescription;
