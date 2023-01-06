import { For } from "solid-js";

import { Calendar, I18nProvider } from "../src";

export default function App() {
  return (
    <div class="app">
      <I18nProvider>
        <Calendar class="calendar">
          {({ title, weekDays, weeksInMonth }) => (
            <>
              <div class="header">
                <Calendar.PrevButton class="button">&lsaquo;</Calendar.PrevButton>
                <h2>{title()}</h2>
                <Calendar.NextButton class="button">&rsaquo;</Calendar.NextButton>
              </div>
              <Calendar.Grid cell-padding="0" class="grid">
                <thead aria-hidden="true">
                  <tr>
                    <For each={weekDays()}>{day => <th>{day}</th>}</For>
                  </tr>
                </thead>
                <tbody>
                  <For each={weeksInMonth()}>
                    {datesInWeek => (
                      <tr>
                        <For each={datesInWeek}>
                          {date => (
                            <Calendar.Cell date={date}>
                              <Calendar.CellButton class="cell" />
                            </Calendar.Cell>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </tbody>
              </Calendar.Grid>
            </>
          )}
        </Calendar>
      </I18nProvider>
    </div>
  );
}
