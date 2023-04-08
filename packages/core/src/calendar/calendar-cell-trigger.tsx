import { OverrideComponentProps } from "@kobalte/utils";

import * as Button from "../button";

export type CalendarCellTriggerProps = OverrideComponentProps<"button", Button.ButtonRootOptions>;

export function CalendarCellTrigger(props: CalendarCellTriggerProps) {
  return <Button.Root {...props} />;
}
