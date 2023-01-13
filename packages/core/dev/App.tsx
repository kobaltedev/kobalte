import { ComponentProps, For } from "solid-js";

import { Calendar, I18nProvider, RadioGroup } from "../src";

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
        <Calendar class="calendar" visibleMonths={months.length}>
          <For each={months}>{offset => <CalendarMonth offset={offset} />}</For>
        </Calendar>

        <RadioGroup value="cats">
          <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
          <div>
            <RadioGroup.Item value="dogs">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl />
              <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
            </RadioGroup.Item>
            <RadioGroup.Item value="cats">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl />
              <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
            </RadioGroup.Item>
            <RadioGroup.Item value="dragons">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl />
              <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          </div>
        </RadioGroup>
      </I18nProvider>
    </div>
  );
}
