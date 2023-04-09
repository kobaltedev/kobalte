import { Show } from "solid-js";

import { Calendar, I18nProvider } from "../src";

export default function App() {
  return (
    <I18nProvider locale="en-US">
      <div class="app">
        <Calendar.Root class="calendar">
          <header class="header">
            <Calendar.PrevTrigger class="button">&lsaquo;</Calendar.PrevTrigger>
            <Calendar.Heading class="heading" />
            <Calendar.NextTrigger class="button">&rsaquo;</Calendar.NextTrigger>
          </header>
          <Calendar.Grid class="grid">
            <Calendar.GridHeader>
              <Calendar.HeaderRow>
                {weekDay => <Calendar.HeaderCell>{weekDay}</Calendar.HeaderCell>}
              </Calendar.HeaderRow>
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {weekIndex => (
                <Calendar.Row weekIndex={weekIndex}>
                  {date => (
                    <Show when={date} fallback={<td />}>
                      <Calendar.Cell date={date!}>
                        <Calendar.CellTrigger as="div" class="cell" />
                      </Calendar.Cell>
                    </Show>
                  )}
                </Calendar.Row>
              )}
            </Calendar.GridBody>
          </Calendar.Grid>
        </Calendar.Root>
      </div>
    </I18nProvider>
  );
}
