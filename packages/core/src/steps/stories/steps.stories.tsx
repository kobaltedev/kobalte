import { createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import * as Steps from "../index";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Steps",
	tags: ["autodocs"],
});

export default meta;

const STEP_TITLES = ["Account", "Profile", "Confirmation"];

function StepIndicator(props: { index: number }) {
	return (
		<Steps.Indicator class={style.indicator}>{props.index + 1}</Steps.Indicator>
	);
}

/** A basic horizontal 3-step wizard. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<div class={style.wrapper}>
			<Steps.Root count={3}>
				<Steps.List class={style.list}>
					<For each={STEP_TITLES}>
						{(title, index) => (
							<Steps.Item index={index()} class={style.item}>
								<Steps.Trigger class={style.trigger}>
									<StepIndicator index={index()} />
									<span class={style.label}>{title}</span>
								</Steps.Trigger>
								{index() < STEP_TITLES.length - 1 && (
									<Steps.Separator class={style.separator} />
								)}
							</Steps.Item>
						)}
					</For>
				</Steps.List>

				<Steps.Content index={0} class={style.content}>
					Create your account by choosing a username and password.
				</Steps.Content>
				<Steps.Content index={1} class={style.content}>
					Tell us a bit about yourself.
				</Steps.Content>
				<Steps.Content index={2} class={style.content}>
					Review your details and confirm.
				</Steps.Content>
				<Steps.CompletedContent class={style.content}>
					🎉 All steps completed — you're all set!
				</Steps.CompletedContent>

				<div class={style.actions}>
					<Steps.PrevTrigger class={style.button}>Back</Steps.PrevTrigger>
					<Steps.NextTrigger class={style.button}>Next</Steps.NextTrigger>
				</div>
			</Steps.Root>
		</div>
	),
});

/** Vertical orientation, useful for sidebars. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<div class={style.wrapperVertical}>
			<Steps.Root count={3} orientation="vertical">
				<Steps.List class={style.listVertical}>
					<For each={STEP_TITLES}>
						{(title, index) => (
							<Steps.Item index={index()} class={style.itemVertical}>
								<Steps.Trigger class={style.trigger}>
									<StepIndicator index={index()} />
									<span class={style.label}>{title}</span>
								</Steps.Trigger>
								{index() < STEP_TITLES.length - 1 && (
									<Steps.Separator class={style.separatorVertical} />
								)}
							</Steps.Item>
						)}
					</For>
				</Steps.List>

				<div class={style.verticalContent}>
					<Steps.Content index={0} class={style.content}>
						Create your account by choosing a username and password.
					</Steps.Content>
					<Steps.Content index={1} class={style.content}>
						Tell us a bit about yourself.
					</Steps.Content>
					<Steps.Content index={2} class={style.content}>
						Review your details and confirm.
					</Steps.Content>
					<Steps.CompletedContent class={style.content}>
						🎉 All steps completed — you're all set!
					</Steps.CompletedContent>

					<div class={style.actions}>
						<Steps.PrevTrigger class={style.button}>Back</Steps.PrevTrigger>
						<Steps.NextTrigger class={style.button}>Next</Steps.NextTrigger>
					</div>
				</div>
			</Steps.Root>
		</div>
	),
});

/** Progress bar reflecting completion, plus a live percent readout. */
export const WithProgress = meta.story({
	name: "With Progress",
	render: () => {
		const [value, setValue] = createSignal(0);

		return (
			<div class={style.wrapper}>
				<Steps.Root count={4} value={value()} onChange={setValue}>
					<div class={style.progressTrack}>
						<Steps.Progress class={style.progressFill} />
					</div>

					<Steps.List class={`${style.list} ${style.listProgress}`}>
						<For each={Array.from({ length: 4 })}>
							{(_, index) => (
								<Steps.Item index={index()} class={style.item}>
									<Steps.Trigger class={style.trigger}>
										<StepIndicator index={index()} />
									</Steps.Trigger>
									{index() < 3 && <Steps.Separator class={style.separator} />}
								</Steps.Item>
							)}
						</For>
					</Steps.List>

					<div class={style.progressActions}>
						<Steps.PrevTrigger class={style.button}>Back</Steps.PrevTrigger>
						<p class={style.stepStatus}>Step {value() + 1} of 4</p>
						<Steps.NextTrigger class={style.button}>Next</Steps.NextTrigger>
					</div>
				</Steps.Root>
			</div>
		);
	},
});

/**
 * Linear mode: the current step must be valid before the wizard allows
 * advancing, and jumping ahead by clicking a later step is blocked.
 */
export const Linear = meta.story({
	name: "Linear",
	render: () => {
		const [email, setEmail] = createSignal("");
		const [invalidMessage, setInvalidMessage] = createSignal<string | null>(
			null,
		);

		const isStepValid = (index: number) => index !== 0 || email().includes("@");

		return (
			<div class={style.wrapper}>
				<Steps.Root
					count={3}
					linear
					isStepValid={isStepValid}
					onStepInvalid={() => setInvalidMessage("Enter a valid email first.")}
					onChange={() => setInvalidMessage(null)}
				>
					<Steps.List class={style.list}>
						<For each={STEP_TITLES}>
							{(title, index) => (
								<Steps.Item index={index()} class={style.item}>
									<Steps.Trigger class={style.trigger}>
										<StepIndicator index={index()} />
										<span class={style.label}>{title}</span>
									</Steps.Trigger>
									{index() < STEP_TITLES.length - 1 && (
										<Steps.Separator class={style.separator} />
									)}
								</Steps.Item>
							)}
						</For>
					</Steps.List>

					<Steps.Content index={0} class={style.content}>
						<label class={style.emailLabel}>
							Email address
							<input
								type="email"
								value={email()}
								onInput={(e) => setEmail(e.currentTarget.value)}
								class={style.emailInput}
								placeholder="you@example.com"
							/>
						</label>
					</Steps.Content>
					<Steps.Content index={1} class={style.content}>
						Tell us a bit about yourself.
					</Steps.Content>
					<Steps.Content index={2} class={style.content}>
						Review your details and confirm.
					</Steps.Content>
					<Steps.CompletedContent class={style.content}>
						🎉 All steps completed — you're all set!
					</Steps.CompletedContent>

					{invalidMessage() && (
						<p class={style.errorMessage}>{invalidMessage()}</p>
					)}

					<div class={style.actions}>
						<Steps.PrevTrigger class={style.button}>Back</Steps.PrevTrigger>
						<Steps.NextTrigger class={style.button}>Next</Steps.NextTrigger>
					</div>
				</Steps.Root>
			</div>
		);
	},
});

/** A step marked `isStepSkippable` is bypassed by next/prev navigation. */
export const Skippable = meta.story({
	name: "Skippable",
	render: () => (
		<div class={style.wrapper}>
			<Steps.Root count={4} isStepSkippable={(index) => index === 2}>
				<Steps.List class={style.list}>
					<For each={Array.from({ length: 4 })}>
						{(_, index) => (
							<Steps.Item index={index()} class={style.item}>
								<Steps.Trigger class={style.trigger}>
									<StepIndicator index={index()} />
								</Steps.Trigger>
								{index() < 3 && <Steps.Separator class={style.separator} />}
							</Steps.Item>
						)}
					</For>
				</Steps.List>

				<Steps.Content index={0} class={style.content}>
					Step 1 (normal)
				</Steps.Content>
				<Steps.Content index={1} class={style.content}>
					Step 2 (normal)
				</Steps.Content>
				<Steps.Content index={2} class={style.content}>
					Step 3 — skippable, only reachable by clicking its trigger directly.
				</Steps.Content>
				<Steps.Content index={3} class={style.content}>
					Step 4 (normal)
				</Steps.Content>
				<Steps.CompletedContent class={style.content}>
					All done!
				</Steps.CompletedContent>

				<div class={style.actions}>
					<Steps.PrevTrigger class={style.button}>Back</Steps.PrevTrigger>
					<Steps.NextTrigger class={style.button}>Next</Steps.NextTrigger>
				</div>
			</Steps.Root>
		</div>
	),
});

/** Controlled `value`/`onChange`, with a reset button. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => {
		const [value, setValue] = createSignal(0);

		return (
			<div class={style.wrapperControlled}>
				<Steps.Root count={3} value={value()} onChange={setValue}>
					<Steps.List class={style.list}>
						<For each={STEP_TITLES}>
							{(title, index) => (
								<Steps.Item index={index()} class={style.item}>
									<Steps.Trigger class={style.trigger}>
										<StepIndicator index={index()} />
										<span class={style.label}>{title}</span>
									</Steps.Trigger>
									{index() < STEP_TITLES.length - 1 && (
										<Steps.Separator class={style.separator} />
									)}
								</Steps.Item>
							)}
						</For>
					</Steps.List>

					<Steps.CompletedContent class={style.content}>
						All done!
					</Steps.CompletedContent>

					<div class={style.actions}>
						<Steps.PrevTrigger class={style.button}>Back</Steps.PrevTrigger>
						<button
							type="button"
							class={style.button}
							onClick={() => setValue(0)}
						>
							Reset
						</button>
						<Steps.NextTrigger class={style.button}>Next</Steps.NextTrigger>
					</div>
				</Steps.Root>
				<p class={style.stepStatus}>Current step index: {value()}</p>
			</div>
		);
	},
});
