import { DatePicker } from "@kobalte/core/date-picker";
import { createSignal, Show } from "solid-js";
import calendarStyle from "./calendar.module.css";
import style from "./date-picker.module.css";

function DatePickerContent() {
	return (
		<>
			<DatePicker.Trigger class={style["date-picker__trigger"]}>
				<DatePicker.Value class={style["date-picker__value"]}>
					Pick a date
				</DatePicker.Value>
			</DatePicker.Trigger>
			<DatePicker.Portal>
				<DatePicker.Content class={style["date-picker__content"]}>
					<DatePicker.Arrow />
					<DatePicker.Calendar>
						<DatePicker.CalendarHeader class={calendarStyle.calendar__header}>
							<DatePicker.CalendarPrevTrigger
								class={calendarStyle.calendar__trigger}
							>
								{"<"}
							</DatePicker.CalendarPrevTrigger>
							<DatePicker.CalendarHeading
								class={calendarStyle.calendar__heading}
							/>
							<DatePicker.CalendarNextTrigger
								class={calendarStyle.calendar__trigger}
							>
								{">"}
							</DatePicker.CalendarNextTrigger>
						</DatePicker.CalendarHeader>
						<DatePicker.CalendarBody>
							<DatePicker.CalendarGrid class={calendarStyle.calendar__grid}>
								<DatePicker.CalendarGridHeader>
									<DatePicker.CalendarGridHeaderRow>
										{(weekDay) => (
											<DatePicker.CalendarGridHeaderCell
												class={calendarStyle["calendar__grid-header-cell"]}
											>
												{weekDay()}
											</DatePicker.CalendarGridHeaderCell>
										)}
									</DatePicker.CalendarGridHeaderRow>
								</DatePicker.CalendarGridHeader>
								<DatePicker.CalendarGridBody>
									{(weekIndex) => (
										<DatePicker.CalendarGridBodyRow weekIndex={weekIndex()}>
											{(date) => (
												<Show
													when={date()}
													fallback={
														<td
															class={calendarStyle["calendar__grid-body-cell"]}
														/>
													}
												>
													<DatePicker.CalendarGridBodyCell
														date={date()!}
														class={calendarStyle["calendar__grid-body-cell"]}
													>
														<DatePicker.CalendarGridBodyCellTrigger
															class={
																calendarStyle[
																	"calendar__grid-body-cell-trigger"
																]
															}
														/>
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
		</>
	);
}

export function BasicExample() {
	return (
		<DatePicker class={style["date-picker"]} selectionMode="single">
			<DatePicker.Label class={style["date-picker__label"]}>
				Event date
			</DatePicker.Label>
			<DatePickerContent />
		</DatePicker>
	);
}

export function MultipleExample() {
	return (
		<DatePicker class={style["date-picker"]} selectionMode="multiple">
			<DatePicker.Label class={style["date-picker__label"]}>
				Event dates
			</DatePicker.Label>
			<DatePickerContent />
		</DatePicker>
	);
}

export function RangeExample() {
	return (
		<DatePicker class={style["date-picker"]} selectionMode="range">
			<DatePicker.Label class={style["date-picker__label"]}>
				Trip dates
			</DatePicker.Label>
			<DatePickerContent />
		</DatePicker>
	);
}

export function MinMaxExample() {
	return (
		<DatePicker
			class={style["date-picker"]}
			selectionMode="single"
			defaultValue={new Date(2024, 5, 15)}
			minValue={new Date(2024, 0, 1)}
			maxValue={new Date(2024, 11, 31)}
		>
			<DatePicker.Label class={style["date-picker__label"]}>
				Date
			</DatePicker.Label>
			<DatePickerContent />
			<DatePicker.ErrorMessage class={style["date-picker__error-message"]}>
				Select a date in 2024.
			</DatePicker.ErrorMessage>
		</DatePicker>
	);
}

export function DisabledExample() {
	return (
		<DatePicker class={style["date-picker"]} selectionMode="single" disabled>
			<DatePicker.Label class={style["date-picker__label"]}>
				Date
			</DatePicker.Label>
			<DatePickerContent />
		</DatePicker>
	);
}

export function DescriptionExample() {
	return (
		<DatePicker class={style["date-picker"]} selectionMode="single">
			<DatePicker.Label class={style["date-picker__label"]}>
				Date
			</DatePicker.Label>
			<DatePickerContent />
			<DatePicker.Description class={style["date-picker__description"]}>
				Select a meeting date.
			</DatePicker.Description>
		</DatePicker>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal<Date | undefined>(undefined);

	return (
		<DatePicker
			class={style["date-picker"]}
			selectionMode="single"
			value={value() ?? null}
			onChange={setValue}
			validationState={value() === undefined ? "invalid" : "valid"}
		>
			<DatePicker.Label class={style["date-picker__label"]}>
				Date
			</DatePicker.Label>
			<DatePickerContent />
			<DatePicker.ErrorMessage class={style["date-picker__error-message"]}>
				Please select a date.
			</DatePicker.ErrorMessage>
		</DatePicker>
	);
}
