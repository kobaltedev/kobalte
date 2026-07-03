import { Show, createSignal } from "solid-js";
import { TimeField } from "../../../../packages/core/src/time-field";
import style from "./time-field.module.css";

export function BasicExample() {
	return (
		<TimeField class={style["time-field"]}>
			<TimeField.Label class={style["time-field__label"]}>
				Event time
			</TimeField.Label>
			<TimeField.Input class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Input>
		</TimeField>
	);
}

export function DefaultValueExample() {
	return (
		<TimeField
			class={style["time-field"]}
			defaultValue={{ hour: 11, minute: 45 }}
		>
			<TimeField.Input class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Input>
		</TimeField>
	);
}

export function ControlledValueExample() {
	const [value, setValue] = createSignal({ hour: 9, minute: 45 });

	return (
		<>
			<TimeField
				class={style["time-field"]}
				value={value()}
				onChange={setValue}
			>
				<TimeField.Input class={style["time-field__field"]}>
					{(segment) => (
						<TimeField.Segment
							class={style["time-field__segment"]}
							segment={segment()}
						/>
					)}
				</TimeField.Input>
			</TimeField>
			<p class="not-prose text-sm mt-4">
				Selected time:{" "}
				<Show when={value()} fallback={"--"}>
					{JSON.stringify(value())}
				</Show>
			</p>
		</>
	);
}

export function GranularityExample() {
	return (
		<TimeField class={style["time-field"]} granularity="second">
			<TimeField.Input class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Input>
		</TimeField>
	);
}

export function MinMaxExample() {
	return (
		<TimeField
			class={style["time-field"]}
			defaultValue={{ hour: 9, minute: 45 }}
			min={{ hour: 9 }}
			max={{ hour: 17 }}
			hourCycle={12}
		>
			<TimeField.Input class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Input>
			<TimeField.ErrorMessage class={style["time-field__error-message"]}>
				Select time between 9 AM and 5 PM.
			</TimeField.ErrorMessage>
		</TimeField>
	);
}

export function PlaceholderValueExample() {
	return (
		<TimeField class={style["time-field"]} placeholder={{ hour: 9 }}>
			<TimeField.Input class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Input>
		</TimeField>
	);
}

export function HourCycleExample() {
	return (
		<TimeField class={style["time-field"]} hourCycle={12}>
			<TimeField.Input class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Input>
		</TimeField>
	);
}

export function DescriptionExample() {
	return (
		<TimeField class={style["time-field"]}>
			<TimeField.Label class={style["time-field__label"]}>Time</TimeField.Label>
			<TimeField.Input class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Input>
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
			<TimeField.Input class={style["time-field__field"]}>
				{(segment) => (
					<TimeField.Segment
						class={style["time-field__segment"]}
						segment={segment()}
					/>
				)}
			</TimeField.Input>
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
				<TimeField.Input class={style["time-field__field"]}>
					{(segment) => (
						<TimeField.Segment
							class={style["time-field__segment"]}
							segment={segment()}
						/>
					)}
				</TimeField.Input>
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
