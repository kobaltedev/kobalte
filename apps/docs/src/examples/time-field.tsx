import {
	Time,
	getLocalTimeZone,
	parseZonedDateTime,
	toCalendarDateTime,
	today,
} from "@internationalized/date";
import { createSignal } from "solid-js";
import { createDateFormatter } from "../../../../packages/core/src/i18n";
import { TimeField } from "../../../../packages/core/src/time-field";
import style from "./time-field.module.css";

export function BasicExample() {
	return (
		<TimeField class={style["time-field"]}>
			<TimeField.Label class={style["time-field__label"]}>
				Event time
			</TimeField.Label>
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
		</TimeField>
	);
}

export function DefaultValueExample() {
	return (
		<TimeField class={style["time-field"]} defaultValue={new Time(11, 45)}>
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
		</TimeField>
	);
}

export function ControlledValueExample() {
	const [value, setValue] = createSignal(new Time(9, 45));

	const dateFormatter = createDateFormatter({
		hour12: true,
		timeStyle: "short",
	});

	return (
		<>
			<TimeField
				class={style["time-field"]}
				value={value()}
				onChange={setValue}
			>
				<TimeField.Field class={style["time-field__field"]}>
					{(segment) => (
						<TimeField.Segment
							class={style["time-field__segment"]}
							segment={segment()}
						/>
					)}
				</TimeField.Field>
			</TimeField>
			<p class="not-prose text-sm mt-4">
				Selected time:{" "}
				{value()
					? dateFormatter().format(
							toCalendarDateTime(today(getLocalTimeZone()), value()).toDate(
								getLocalTimeZone(),
							),
						)
					: "––"}
			</p>
		</>
	);
}

export function TimeZoneExample() {
	return (
		<TimeField
			class={style["time-field"]}
			defaultValue={parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]")}
		>
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
		</TimeField>
	);
}

export function GranularityExample() {
	return (
		<TimeField class={style["time-field"]} granularity="second">
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
		</TimeField>
	);
}

export function MinMaxExample() {
	return (
		<TimeField
			class={style["time-field"]}
			defaultValue={new Time(9, 45)}
			minValue={new Time(9)}
			maxValue={new Time(17)}
		>
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
			<TimeField.ErrorMessage class={style["time-field__error-message"]}>
				Select time between 9 AM and 5 PM.
			</TimeField.ErrorMessage>
		</TimeField>
	);
}

export function PlaceholderValueExample() {
	return (
		<TimeField class={style["time-field"]} placeholderValue={new Time(9)}>
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
		</TimeField>
	);
}

export function HideTimeZoneExample() {
	return (
		<TimeField
			class={style["time-field"]}
			defaultValue={parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]")}
			hideTimeZone
		>
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
		</TimeField>
	);
}

export function HourCycleExample() {
	return (
		<TimeField class={style["time-field"]} hourCycle={24}>
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
		</TimeField>
	);
}

export function DescriptionExample() {
	return (
		<TimeField class={style["time-field"]}>
			<TimeField.Label class={style["time-field__label"]}>Time</TimeField.Label>
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
			<TimeField.Description class={style["time-field__description"]}>
				Select a meeting time.
			</TimeField.Description>
		</TimeField>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal(undefined);

	return (
		<TimeField
			class={style["time-field"]}
			value={value()}
			onChange={setValue}
			validationState={value() === undefined ? "invalid" : "valid"}
		>
			<TimeField.Label class={style["time-field__label"]}>Time</TimeField.Label>
			<TimeField.Field class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Field>
			<TimeField.ErrorMessage class={style["time-field__error-message"]}>
				Please select a time.
			</TimeField.ErrorMessage>
		</TimeField>
	);
}

export function HTMLFormExample() {
	let formRef: HTMLFormElement | undefined;

	const onSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const formData = new FormData(formRef);

		alert(JSON.stringify(Object.fromEntries(formData), null, 2));
	};

	return (
		<form
			ref={formRef}
			onSubmit={onSubmit}
			class="flex flex-col items-center space-y-6"
		>
			<TimeField class={style["time-field"]} name="time">
				<TimeField.Field class={style["time-field__field"]}>
					{(segment) => (
						<TimeField.Segment
							class={style["time-field__segment"]}
							segment={segment()}
						/>
					)}
				</TimeField.Field>
				<TimeField.HiddenInput />
			</TimeField>
			<div class="flex space-x-2">
				<button type="reset" class="kb-button">
					Reset
				</button>
				<button type="submit" class="kb-button-primary">
					Submit
				</button>
			</div>
		</form>
	);
}
