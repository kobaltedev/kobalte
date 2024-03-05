import { NumberField } from "../src";

export default function App() {
	let formRef: HTMLFormElement | undefined;

	const onSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const formData = new FormData(formRef);

		alert(JSON.stringify(Object.fromEntries(formData), null, 2));
	};

	return (
		<form ref={formRef} onSubmit={onSubmit} class="flex flex-col items-center space-y-6">
			<NumberField.Root name="field-name" defaultValue={10000000}>
				<NumberField.Label>Label</NumberField.Label>
				<NumberField.HiddenInput />
				<NumberField.Input />
				<NumberField.IncrementTrigger>+</NumberField.IncrementTrigger>
				<NumberField.DecrementTrigger>-</NumberField.DecrementTrigger>
				<NumberField.Description>Description</NumberField.Description>
				<NumberField.ErrorMessage>Error message</NumberField.ErrorMessage>
			</NumberField.Root>
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
