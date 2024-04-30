import { ToggleButton } from "@kobalte/core/toggle-button";
import { Show, createSignal } from "solid-js";

import { VolumeOffIcon, VolumeOnIcon } from "../components";
import style from "./toggle-button.module.css";

export function BasicExample() {
	return (
		<ToggleButton class={style["toggle-button"]} aria-label="Mute">
			{(state) => (
				<Show
					when={state.pressed()}
					fallback={<VolumeOnIcon class="h-6 w-6" />}
				>
					<VolumeOffIcon class="h-6 w-6" />
				</Show>
			)}
		</ToggleButton>
	);
}

export function DefaultPressedExample() {
	return (
		<ToggleButton
			class={style["toggle-button"]}
			aria-label="Mute"
			defaultPressed
		>
			{(state) => (
				<Show
					when={state.pressed()}
					fallback={<VolumeOnIcon class="h-6 w-6" />}
				>
					<VolumeOffIcon class="h-6 w-6" />
				</Show>
			)}
		</ToggleButton>
	);
}

export function ControlledExample() {
	const [pressed, setPressed] = createSignal(false);

	return (
		<>
			<ToggleButton
				class={style["toggle-button"]}
				aria-label="Mute"
				pressed={pressed()}
				onChange={setPressed}
			>
				{(state) => (
					<Show
						when={state.pressed()}
						fallback={<VolumeOnIcon class="h-6 w-6" />}
					>
						<VolumeOffIcon class="h-6 w-6" />
					</Show>
				)}
			</ToggleButton>
			<p class="not-prose text-sm mt-2">
				The microphone is {pressed() ? "muted" : "active"}.
			</p>
		</>
	);
}
