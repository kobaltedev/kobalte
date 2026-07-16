import { Steps } from "@kobalte/core/steps";
import { createSignal, For } from "solid-js";

import style from "./steps.module.css";

const STEP_TITLES = ["Account", "Profile", "Confirmation"];

function StepIndicator(props: { index: number }) {
	return (
		<Steps.Indicator class={style["steps__indicator"]}>
			{props.index + 1}
		</Steps.Indicator>
	);
}

export function BasicExample() {
	return (
		<Steps count={3}>
			<Steps.List class={style["steps__list"]}>
				<For each={STEP_TITLES}>
					{(title, index) => (
						<Steps.Item index={index()} class={style["steps__item"]}>
							<Steps.Trigger class={style["steps__trigger"]}>
								<StepIndicator index={index()} />
								<span class={style["steps__label"]}>{title}</span>
							</Steps.Trigger>
							{index() < STEP_TITLES.length - 1 && (
								<Steps.Separator class={style["steps__separator"]} />
							)}
						</Steps.Item>
					)}
				</For>
			</Steps.List>

			<Steps.Content index={0} class={style["steps__content"]}>
				Create your account by choosing a username and password.
			</Steps.Content>
			<Steps.Content index={1} class={style["steps__content"]}>
				Tell us a bit about yourself.
			</Steps.Content>
			<Steps.Content index={2} class={style["steps__content"]}>
				Review your details and confirm.
			</Steps.Content>
			<Steps.CompletedContent class={style["steps__content"]}>
				🎉 All steps completed — you're all set!
			</Steps.CompletedContent>

			<div class="not-prose flex justify-between mt-4">
				<Steps.PrevTrigger class="kb-button">Back</Steps.PrevTrigger>
				<Steps.NextTrigger class="kb-button-primary">Next</Steps.NextTrigger>
			</div>
		</Steps>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal(0);

	return (
		<div class="flex flex-col gap-2">
			<Steps count={3} value={value()} onChange={setValue}>
				<Steps.List class={style["steps__list"]}>
					<For each={STEP_TITLES}>
						{(title, index) => (
							<Steps.Item index={index()} class={style["steps__item"]}>
								<Steps.Trigger class={style["steps__trigger"]}>
									<StepIndicator index={index()} />
									<span class={style["steps__label"]}>{title}</span>
								</Steps.Trigger>
								{index() < STEP_TITLES.length - 1 && (
									<Steps.Separator class={style["steps__separator"]} />
								)}
							</Steps.Item>
						)}
					</For>
				</Steps.List>

				<div class="not-prose flex justify-between mt-4">
					<Steps.PrevTrigger class="kb-button">Back</Steps.PrevTrigger>
					<Steps.NextTrigger class="kb-button-primary">Next</Steps.NextTrigger>
				</div>
			</Steps>
			<p class="not-prose text-sm mt-2">Current step index: {value()}</p>
		</div>
	);
}

export function ProgressExample() {
	return (
		<Steps count={4}>
			<div class={style["steps__progress-track"]}>
				<Steps.Progress class={style["steps__progress-fill"]} />
			</div>

			<Steps.List class={`${style["steps__list"]} mt-4`}>
				<For each={Array.from({ length: 4 })}>
					{(_, index) => (
						<Steps.Item index={index()} class={style["steps__item"]}>
							<Steps.Trigger class={style["steps__trigger"]}>
								<StepIndicator index={index()} />
							</Steps.Trigger>
							{index() < 3 && (
								<Steps.Separator class={style["steps__separator"]} />
							)}
						</Steps.Item>
					)}
				</For>
			</Steps.List>

			<div class="not-prose flex justify-between mt-4">
				<Steps.PrevTrigger class="kb-button">Back</Steps.PrevTrigger>
				<Steps.NextTrigger class="kb-button-primary">Next</Steps.NextTrigger>
			</div>
		</Steps>
	);
}

export function LinearExample() {
	const [email, setEmail] = createSignal("");
	const [invalidMessage, setInvalidMessage] = createSignal<string | null>(
		null,
	);

	const isStepValid = (index: number) => index !== 0 || email().includes("@");

	return (
		<Steps
			count={3}
			linear
			isStepValid={isStepValid}
			onStepInvalid={() => setInvalidMessage("Enter a valid email first.")}
			onChange={() => setInvalidMessage(null)}
		>
			<Steps.List class={style["steps__list"]}>
				<For each={STEP_TITLES}>
					{(title, index) => (
						<Steps.Item index={index()} class={style["steps__item"]}>
							<Steps.Trigger class={style["steps__trigger"]}>
								<StepIndicator index={index()} />
								<span class={style["steps__label"]}>{title}</span>
							</Steps.Trigger>
							{index() < STEP_TITLES.length - 1 && (
								<Steps.Separator class={style["steps__separator"]} />
							)}
						</Steps.Item>
					)}
				</For>
			</Steps.List>

			<Steps.Content index={0} class={style["steps__content"]}>
				<label class="not-prose flex flex-col gap-1 text-sm">
					Email address
					<input
						type="email"
						value={email()}
						onInput={(e) => setEmail(e.currentTarget.value)}
						placeholder="you@example.com"
						class="rounded border border-slate-300 px-2 py-1"
					/>
				</label>
			</Steps.Content>
			<Steps.Content index={1} class={style["steps__content"]}>
				Tell us a bit about yourself.
			</Steps.Content>
			<Steps.Content index={2} class={style["steps__content"]}>
				Review your details and confirm.
			</Steps.Content>
			<Steps.CompletedContent class={style["steps__content"]}>
				🎉 All steps completed — you're all set!
			</Steps.CompletedContent>

			{invalidMessage() && (
				<p class="not-prose text-sm text-red-600 mt-2">{invalidMessage()}</p>
			)}

			<div class="not-prose flex justify-between mt-4">
				<Steps.PrevTrigger class="kb-button">Back</Steps.PrevTrigger>
				<Steps.NextTrigger class="kb-button-primary">Next</Steps.NextTrigger>
			</div>
		</Steps>
	);
}

export function SkippableExample() {
	return (
		<Steps count={4} isStepSkippable={(index) => index === 2}>
			<Steps.List class={style["steps__list"]}>
				<For each={Array.from({ length: 4 })}>
					{(_, index) => (
						<Steps.Item index={index()} class={style["steps__item"]}>
							<Steps.Trigger class={style["steps__trigger"]}>
								<StepIndicator index={index()} />
							</Steps.Trigger>
							{index() < 3 && (
								<Steps.Separator class={style["steps__separator"]} />
							)}
						</Steps.Item>
					)}
				</For>
			</Steps.List>

			<Steps.Content index={0} class={style["steps__content"]}>
				Step 1 (normal)
			</Steps.Content>
			<Steps.Content index={1} class={style["steps__content"]}>
				Step 2 (normal)
			</Steps.Content>
			<Steps.Content index={2} class={style["steps__content"]}>
				Step 3 — skippable, only reachable by clicking its trigger directly.
			</Steps.Content>
			<Steps.Content index={3} class={style["steps__content"]}>
				Step 4 (normal)
			</Steps.Content>
			<Steps.CompletedContent class={style["steps__content"]}>
				All done!
			</Steps.CompletedContent>

			<div class="not-prose flex justify-between mt-4">
				<Steps.PrevTrigger class="kb-button">Back</Steps.PrevTrigger>
				<Steps.NextTrigger class="kb-button-primary">Next</Steps.NextTrigger>
			</div>
		</Steps>
	);
}
