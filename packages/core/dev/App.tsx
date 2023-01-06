import { For, Index } from "solid-js";

import { Calendar, I18nProvider } from "../src";

export default function App() {
  return (
    <div class="app">
      <button>Prev</button>
      <I18nProvider>
        <Calendar class="calendar">
          {state => (
            <>
              <div class="header">
                <Calendar.PrevYearButton class="button">&lsaquo;&lsaquo;</Calendar.PrevYearButton>
                <Calendar.PrevPageButton class="button">&lsaquo;</Calendar.PrevPageButton>
                <h2>{state.title()}</h2>
                <Calendar.NextPageButton class="button">&rsaquo;</Calendar.NextPageButton>
                <Calendar.NextYearButton class="button">&rsaquo;&rsaquo;</Calendar.NextYearButton>
              </div>
              <Calendar.Grid cell-padding="0" class="grid">
                <thead aria-hidden="true">
                  <tr>
                    <For each={state.weekDays()}>{day => <th>{day}</th>}</For>
                  </tr>
                </thead>
                <tbody>
                  <For each={[...new Array(state.weeksInMonth()).keys()]}>
                    {weekIndex => (
                      <tr>
                        <For each={state.getDatesInWeek(weekIndex)}>
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
      <button>Last</button>
    </div>
  );
}
