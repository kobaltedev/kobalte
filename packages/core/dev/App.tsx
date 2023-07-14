import {
  parseDate,
  today,
  createCalendar,
  getLocalTimeZone,
  type DateValue,
  now,
  parseZonedDateTime,
} from "@internationalized/date";
import { RangeValue } from "@kobalte/utils";
import { batch, createSignal, For, Show } from "solid-js";

import {
  Calendar,
  createDateFormatter,
  DatePicker,
  I18nProvider,
  createFilter,
  Combobox,
} from "../src";

//
const ALL_OPTIONS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];
function Foo() {
  const [value, setValue] = createSignal<string | null>("Blueberry");

  const filter = createFilter({ sensitivity: "base" });

  const [options, setOptions] = createSignal(ALL_OPTIONS);

  const onOpenChange = (isOpen: boolean, triggerMode?: Combobox.ComboboxTriggerMode) => {
    // Show all options on ArrowDown/ArrowUp and button click.
    if (isOpen && triggerMode === "manual") {
      setOptions(ALL_OPTIONS);
    }
  };

  const onInputChange = (value: string) => {
    // Remove selection when input is cleared.
    if (value === "") {
      setValue(null);
    }

    setOptions(ALL_OPTIONS.filter(option => filter.contains(option, value)));
  };

  return (
    <>
      <button onClick={() => setValue(null)}>Clear</button>
      <button onClick={() => setValue("Apple")}>Select Apple</button>
      {value()}
      <Combobox.Root
        options={options()}
        onInputChange={onInputChange}
        onOpenChange={onOpenChange}
        value={value()}
        onChange={setValue}
        placeholder="Search a fruit…"
        itemComponent={props => (
          <Combobox.Item item={props.item} class="combobox__item">
            <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class="combobox__item-indicator">X</Combobox.ItemIndicator>
          </Combobox.Item>
        )}
      >
        <Combobox.Control class="combobox__control" aria-label="Fruit">
          <Combobox.Input class="combobox__input" />
          <Combobox.Trigger class="combobox__trigger">
            <Combobox.Icon class="combobox__icon">V</Combobox.Icon>
          </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Portal>
          <Combobox.Content class="combobox__content">
            <Combobox.Listbox class="combobox__listbox" />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
    </>
  );
}
//

export default function App() {
  const [value, setValue] = createSignal<DateValue | null>();
  //const [value, setValue] = createSignal<DateValue[]>([]);
  //const [value, setValue] = createSignal<RangeValue<DateValue>>();

  return (
    <I18nProvider locale="en-US">
      <>
        <Foo />
        <br />
        <br />
        <hr />
        <br />
        <br />
        <button onClick={() => setValue(null)}>Clear value: {value()?.toString()}</button>
        <DatePicker.Root
          createCalendar={createCalendar}
          selectionMode="single"
          hourCycle={24}
          shouldForceLeadingZeros
          value={value()}
          onChange={setValue}
        >
          <DatePicker.Control class="control">
            <DatePicker.Input class="input">
              {segment => <DatePicker.Segment segment={segment()} />}
            </DatePicker.Input>
            <DatePicker.Trigger>🗓</DatePicker.Trigger>
          </DatePicker.Control>
          <DatePicker.Portal>
            <DatePicker.Content class="content">
              <DatePicker.Arrow />
              <DatePicker.Calendar class="calendar">
                <DatePicker.CalendarHeader class="header">
                  <DatePicker.CalendarPrevTrigger class="button">
                    &lsaquo;
                  </DatePicker.CalendarPrevTrigger>
                  <DatePicker.CalendarHeading class="heading" />
                  <DatePicker.CalendarNextTrigger class="button">
                    &rsaquo;
                  </DatePicker.CalendarNextTrigger>
                </DatePicker.CalendarHeader>
                <DatePicker.CalendarBody>
                  <DatePicker.CalendarGrid class="grid">
                    <DatePicker.CalendarGridHeader>
                      <DatePicker.CalendarGridHeaderRow>
                        {weekDay => (
                          <DatePicker.CalendarGridHeaderCell>
                            {weekDay()}
                          </DatePicker.CalendarGridHeaderCell>
                        )}
                      </DatePicker.CalendarGridHeaderRow>
                    </DatePicker.CalendarGridHeader>
                    <DatePicker.CalendarGridBody>
                      {weekIndex => (
                        <DatePicker.CalendarGridBodyRow weekIndex={weekIndex()}>
                          {date => (
                            <Show when={date()} fallback={<td />}>
                              <DatePicker.CalendarGridBodyCell date={date()!}>
                                <DatePicker.CalendarGridBodyCellTrigger class="cell" />
                              </DatePicker.CalendarGridBodyCell>
                            </Show>
                          )}
                        </DatePicker.CalendarGridBodyRow>
                      )}
                    </DatePicker.CalendarGridBody>
                  </DatePicker.CalendarGrid>
                </DatePicker.CalendarBody>
              </DatePicker.Calendar>
            </DatePicker.Content>
          </DatePicker.Portal>
        </DatePicker.Root>
      </>
    </I18nProvider>
  );
}

/*

<Calendar.Root
  class="calendar"
  createCalendar={createCalendar}
  selectionMode="single"
  value={value()}
  onChange={setValue}
>
  <Calendar.Header class="header">
    <Calendar.PrevTrigger class="button">&lsaquo;</Calendar.PrevTrigger>
    <Calendar.Heading class="heading" />
    <Calendar.NextTrigger class="button">&rsaquo;</Calendar.NextTrigger>
  </Calendar.Header>
  <Calendar.Body>
    <Calendar.Grid class="grid">
      <Calendar.GridHeader>
        <Calendar.GridHeaderRow>
          {weekDay => <Calendar.GridHeaderCell>{weekDay()}</Calendar.GridHeaderCell>}
        </Calendar.GridHeaderRow>
      </Calendar.GridHeader>
      <Calendar.GridBody>
        {weekIndex => (
          <Calendar.GridBodyRow weekIndex={weekIndex()}>
            {date => (
              <Show when={date()} fallback={<td />}>
                <Calendar.GridBodyCell date={date()!}>
                  <Calendar.GridBodyCellTrigger class="cell" />
                </Calendar.GridBodyCell>
              </Show>
            )}
          </Calendar.GridBodyRow>
        )}
      </Calendar.GridBody>
    </Calendar.Grid>
  </Calendar.Body>
</Calendar.Root>

*/
