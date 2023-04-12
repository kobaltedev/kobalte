import { createCalendar } from "@internationalized/date";
import { OverrideComponentProps } from "@kobalte/utils";

import { useLocale } from "../i18n";
import { DatePickerBase, DatePickerBaseOptions } from "./date-picker-base";

export interface DatePickerRootOptions extends Partial<DatePickerBaseOptions> {}

export type DatePickerRootProps = OverrideComponentProps<"div", DatePickerRootOptions>;

export function DatePickerRoot(props: DatePickerRootProps) {
  const { locale } = useLocale();

  return <DatePickerBase locale={locale()} createCalendar={createCalendar} {...props} />;
}
