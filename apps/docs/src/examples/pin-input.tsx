import { PinInput } from "@kobalte/core/pin-input";
import { Index } from "solid-js";

import style from "./pin-input.module.css";

export function BasicExample() {
	return (
		<PinInput.Root
			onValueChange={(e) => console.log(e)}
			onValueComplete={(e) => console.log(e)}
			class={style["pin-input-root"]}
			autoFocus
		>
			<PinInput.Label class={style["pin-input-label"]}>
				Pin Input
			</PinInput.Label>
			<PinInput.Control class={style["pin-input-control"]}>
				<Index each={[0, 1, 2, 3]}>
					{(id) => (
						<PinInput.Input index={id()} class={style["pin-input-input"]} />
					)}
				</Index>
			</PinInput.Control>
			<PinInput.HiddenInput class={style["pin-input-hidden-input"]} />
		</PinInput.Root>
	);
}
export function HTMLFormExample() {
	let formRef: HTMLFormElement | undefined;

	const onSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const formData = new FormData(formRef);

		alert(`submitted-pin: ${formData.get("pin")}`);
	};

	return (
		<form ref={formRef} onSubmit={onSubmit} class={style["form-container"]}>
			<PinInput.Root
				onValueChange={(e) => console.log(e)}
				onValueComplete={(e) => console.log(e)}
				class={style["pin-input-root"]}
			>
				<PinInput.Label class={style["pin-input-label"]}>
					Pin Input
				</PinInput.Label>
				<PinInput.Control class={style["pin-input-control"]}>
					<Index each={[0, 1, 2, 3]}>
						{(id) => (
							<PinInput.Input index={id()} class={style["pin-input-input"]} />
						)}
					</Index>
				</PinInput.Control>
				<PinInput.HiddenInput
					class={style["pin-input-hidden-input"]}
					name="pin"
					required
				/>
			</PinInput.Root>
			<button type="submit" class={style["submit-btn"]}>
				Submit Pin
			</button>
		</form>
	);
}

export function DefaultValueExample() {
	return (
		<PinInput.Root
			defaultValue={["1", "2"]}
			onValueChange={(e) => console.log(e)}
			onValueComplete={(e) => console.log(e)}
			class={style["pin-input-root"]}
		>
			<PinInput.Label class={style["pin-input-label"]}>
				Pin Input
			</PinInput.Label>
			<PinInput.Control class={style["pin-input-control"]}>
				<Index each={[0, 1, 2, 3]}>
					{(id) => (
						<PinInput.Input index={id()} class={style["pin-input-input"]} />
					)}
				</Index>
			</PinInput.Control>
			<PinInput.HiddenInput class={style["pin-input-hidden-input"]} />
		</PinInput.Root>
	);
}

export function OTPExample() {
	return (
		<PinInput.Root
			defaultValue={["1", "2"]}
			onValueChange={(e) => console.log(e)}
			onValueComplete={(e) => console.log(e)}
			class={style["pin-input-root"]}
			otp
		>
			<PinInput.Label class={style["pin-input-label"]}>
				Enter your OTP
			</PinInput.Label>
			<PinInput.Control class={style["pin-input-control"]}>
				<Index each={[0, 1, 2, 3]}>
					{(id) => (
						<PinInput.Input index={id()} class={style["pin-input-input"]} />
					)}
				</Index>
			</PinInput.Control>
			<PinInput.HiddenInput class={style["pin-input-hidden-input"]} />
		</PinInput.Root>
	);
}

export function MaskExample() {
	return (
		<PinInput.Root
			defaultValue={["1", "2", "3", "4"]}
			onValueChange={(e) => console.log(e)}
			onValueComplete={(e) => console.log(e)}
			class={style["pin-input-root"]}
			mask
		>
			<PinInput.Label class={style["pin-input-label"]}>
				Enter your Secure Pin
			</PinInput.Label>
			<PinInput.Control class={style["pin-input-control"]}>
				<Index each={[0, 1, 2, 3]}>
					{(id) => (
						<PinInput.Input index={id()} class={style["pin-input-input"]} />
					)}
				</Index>
			</PinInput.Control>
			<PinInput.HiddenInput class={style["pin-input-hidden-input"]} />
		</PinInput.Root>
	);
}

export function PlaceholderExample() {
	return (
		<PinInput.Root
			onValueChange={(e) => console.log(e)}
			onValueComplete={(e) => console.log(e)}
			class={style["pin-input-root"]}
			placeholder="*"
		>
			<PinInput.Label class={style["pin-input-label"]}>
				Pin Input
			</PinInput.Label>
			<PinInput.Control class={style["pin-input-control"]}>
				<Index each={[0, 1, 2, 3]}>
					{(id) => (
						<PinInput.Input index={id()} class={style["pin-input-input"]} />
					)}
				</Index>
			</PinInput.Control>
			<PinInput.HiddenInput class={style["pin-input-hidden-input"]} />
		</PinInput.Root>
	);
}
