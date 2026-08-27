import { CalendarDate } from "@internationalized/date";
import { DateField } from "@kobalte/core/date-field";
import { createSignal, Show } from "solid-js";
import style from "./date-field.module.css";

export function BasicExample() {
	return (
		<DateField class={style["date-field"]}>
			<DateField.Label class={style["date-field__label"]}>
				Event date
			</DateField.Label>
			<DateField.Input class={style["date-field__field"]}>
				{(segment) => (
					<DateField.Segment
						class={style["date-field__segment"]}
						segment={segment()}
					/>
				)}
			</DateField.Input>
		</DateField>
	);
}

export function DefaultValueExample() {
	return (
		<DateField
			class={style["date-field"]}
			defaultValue={new CalendarDate(2024, 1, 15)}
		>
			<DateField.Input class={style["date-field__field"]}>
				{(segment) => (
					<DateField.Segment
						class={style["date-field__segment"]}
						segment={segment()}
					/>
				)}
			</DateField.Input>
		</DateField>
	);
}

export function ControlledValueExample() {
	const [value, setValue] = createSignal(new CalendarDate(2024, 1, 15));

	return (
		<>
			<DateField
				class={style["date-field"]}
				value={value()}
				onChange={setValue}
			>
				<DateField.Input class={style["date-field__field"]}>
					{(segment) => (
						<DateField.Segment
							class={style["date-field__segment"]}
							segment={segment()}
						/>
					)}
				</DateField.Input>
			</DateField>
			<p
				style={{
					"font-size": "14px",
					"margin-top": "16px",
					"margin-bottom": 0,
				}}
			>
				Selected date:{" "}
				<Show when={value()} fallback={"--"}>
					{value().toString()}
				</Show>
			</p>
		</>
	);
}

export function GranularityExample() {
	return (
		<DateField class={style["date-field"]} granularity="second">
			<DateField.Input class={style["date-field__field"]}>
				{(segment) => (
					<DateField.Segment
						class={style["date-field__segment"]}
						segment={segment()}
					/>
				)}
			</DateField.Input>
		</DateField>
	);
}

export function MinMaxExample() {
	return (
		<DateField
			class={style["date-field"]}
			defaultValue={new CalendarDate(2024, 6, 15)}
			minValue={new CalendarDate(2024, 1, 1)}
			maxValue={new CalendarDate(2024, 12, 31)}
		>
			<DateField.Input class={style["date-field__field"]}>
				{(segment) => (
					<DateField.Segment
						class={style["date-field__segment"]}
						segment={segment()}
					/>
				)}
			</DateField.Input>
			<DateField.ErrorMessage class={style["date-field__error-message"]}>
				Select a date in 2024.
			</DateField.ErrorMessage>
		</DateField>
	);
}

export function PlaceholderValueExample() {
	return (
		<DateField
			class={style["date-field"]}
			placeholderValue={new CalendarDate(2030, 1, 1)}
		>
			<DateField.Input class={style["date-field__field"]}>
				{(segment) => (
					<DateField.Segment
						class={style["date-field__segment"]}
						segment={segment()}
					/>
				)}
			</DateField.Input>
		</DateField>
	);
}

export function HourCycleExample() {
	return (
		<DateField class={style["date-field"]} granularity="minute" hourCycle={12}>
			<DateField.Input class={style["date-field__field"]}>
				{(segment) => (
					<DateField.Segment
						class={style["date-field__segment"]}
						segment={segment()}
					/>
				)}
			</DateField.Input>
		</DateField>
	);
}

export function DescriptionExample() {
	return (
		<DateField class={style["date-field"]}>
			<DateField.Label class={style["date-field__label"]}>Date</DateField.Label>
			<DateField.Input class={style["date-field__field"]}>
				{(segment) => (
					<DateField.Segment
						class={style["date-field__segment"]}
						segment={segment()}
					/>
				)}
			</DateField.Input>
			<DateField.Description class={style["date-field__description"]}>
				Select a meeting date.
			</DateField.Description>
		</DateField>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal(undefined);

	return (
		<DateField
			class={style["date-field"]}
			value={value()}
			onChange={setValue}
			validationState={value() === undefined ? "invalid" : "valid"}
		>
			<DateField.Label class={style["date-field__label"]}>Date</DateField.Label>
			<DateField.Input class={style["date-field__field"]}>
				{(segment) => (
					<DateField.Segment
						class={style["date-field__segment"]}
						segment={segment()}
					/>
				)}
			</DateField.Input>
			<DateField.ErrorMessage class={style["date-field__error-message"]}>
				Please select a date.
			</DateField.ErrorMessage>
		</DateField>
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
			style={{
				display: "flex",
				"flex-direction": "column",
				"align-items": "center",
				gap: "24px",
			}}
		>
			<DateField class={style["date-field"]} name="date">
				<DateField.Input class={style["date-field__field"]}>
					{(segment) => (
						<DateField.Segment
							class={style["date-field__segment"]}
							segment={segment()}
						/>
					)}
				</DateField.Input>
				<DateField.HiddenInput />
			</DateField>
			<div style={{ display: "flex", gap: "8px" }}>
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
