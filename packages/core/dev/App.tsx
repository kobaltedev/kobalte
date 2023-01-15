import { ComponentProps, For } from "solid-js";

import { Calendar, Checkbox, I18nProvider, Popover } from "../src";

function CalendarMonth(props: ComponentProps<typeof Calendar.Month>) {
  return (
    <Calendar.Month {...props}>
      <Calendar.Header class="header">
        <Calendar.PrevPageButton class="button">&lsaquo;</Calendar.PrevPageButton>
        <Calendar.Title />
        <Calendar.NextPageButton class="button">&rsaquo;</Calendar.NextPageButton>
      </Calendar.Header>
      <Calendar.Grid cell-padding="0" class="grid">
        <Calendar.GridHeader>
          <Calendar.WeekDays class="week-days">
            {day => <Calendar.WeekDay>{day()}</Calendar.WeekDay>}
          </Calendar.WeekDays>
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {weekIndex => (
            <Calendar.Row weekIndex={weekIndex()}>
              {date => (
                <Calendar.Cell date={date()}>
                  <Calendar.Day class="cell" />
                </Calendar.Cell>
              )}
            </Calendar.Row>
          )}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar.Month>
  );
}

export default function App() {
  const months = [...new Array(2).keys()];

  return (
    <div class="app">
      <I18nProvider>
        <Calendar.Root class="calendar" visibleMonths={months.length}>
          <For each={months}>{offset => <CalendarMonth offset={offset} />}</For>
        </Calendar.Root>
        <Checkbox.Root class="checkbox">
          <Checkbox.Input />
          <Checkbox.Control class="checkbox__control">
            <Checkbox.Indicator>x</Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label class="checkbox__label">Subscribe</Checkbox.Label>
        </Checkbox.Root>
        <Popover.Root>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
              <Checkbox.Root class="checkbox">
                <Checkbox.Input />
                <Checkbox.Control class="checkbox__control">
                  <Checkbox.Indicator>x</Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label class="checkbox__label">Subscribe</Checkbox.Label>
              </Checkbox.Root>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </I18nProvider>
    </div>
  );
}
