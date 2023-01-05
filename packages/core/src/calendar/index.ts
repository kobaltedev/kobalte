/*

<Calendar>
  {({ title, weekDays, weeks }) => (
    <div>
      <Calendar.PrevButton />
      <h2>{title()}</h2>
      <Calendar.NextButton />
    </div>
    <Calendar.Grid>
      <Calendar.GridHeader>
        <tr>
          <For each={weekDays()}>
            {day => <th>{day}</th>}
          </For>
        </tr>
      </Calendar.GridHeader>
      <tbody>
        <For each={weeks()}>
          {week => (
            <tr>
              <For each={week.dates()}>
                {date => (
                  <Show when={date} fallback={<td/>}>
                    <Calendar.Cell date={date}>
                      <Calendar.CellButton />
                    </Calendar.Cell>
                  </Show>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </Calendar.Grid>
  )}
</Calendar>

*/
