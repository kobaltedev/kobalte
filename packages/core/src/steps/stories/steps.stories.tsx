import { createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import * as Steps from "../index";

const meta = preview.meta({
	title: "Components/Steps",
	tags: ["autodocs"],
});

export default meta;

const listClass = "flex items-center";
const listVerticalClass = "flex flex-col items-start gap-1";

const itemClass = "flex items-center gap-2 flex-1 last:flex-none";
const itemVerticalClass = "flex flex-col gap-1";

const indicatorClass =
	"flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium " +
	"border-slate-300 text-slate-500 " +
	"data-[current]:border-blue-500 data-[current]:bg-blue-500 data-[current]:text-white " +
	"data-[complete]:border-blue-500 data-[complete]:bg-blue-500 data-[complete]:text-white";

const triggerClass = "flex items-center gap-2 outline-none rounded-full";

const labelClass = "text-sm font-medium text-slate-700";

const separatorClass =
	"h-0.5 flex-1 bg-slate-200 data-[complete]:bg-blue-500 mx-2";

const separatorVerticalClass = "w-0.5 h-6 bg-slate-200 data-[complete]:bg-blue-500 ml-4";

const contentClass = "mt-6 rounded-md border border-slate-200 p-4 text-sm text-slate-700";

const buttonClass =
	"rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 " +
	"hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none";

const STEP_TITLES = ["Account", "Profile", "Confirmation"];

function StepIndicator(props: { index: number }) {
	return <Steps.Indicator class={indicatorClass}>{props.index + 1}</Steps.Indicator>;
}

/** A basic horizontal 3-step wizard. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<div class="w-[480px] font-sans">
			<Steps.Root count={3}>
				<Steps.List class={listClass}>
					<For each={STEP_TITLES}>
						{(title, index) => (
							<Steps.Item index={index()} class={itemClass}>
								<Steps.Trigger class={triggerClass}>
									<StepIndicator index={index()} />
									<span class={labelClass}>{title}</span>
								</Steps.Trigger>
								{index() < STEP_TITLES.length - 1 && (
									<Steps.Separator class={separatorClass} />
								)}
							</Steps.Item>
						)}
					</For>
				</Steps.List>

				<Steps.Content index={0} class={contentClass}>
					Create your account by choosing a username and password.
				</Steps.Content>
				<Steps.Content index={1} class={contentClass}>
					Tell us a bit about yourself.
				</Steps.Content>
				<Steps.Content index={2} class={contentClass}>
					Review your details and confirm.
				</Steps.Content>
				<Steps.CompletedContent class={contentClass}>
					🎉 All steps completed — you're all set!
				</Steps.CompletedContent>

				<div class="mt-4 flex justify-between">
					<Steps.PrevTrigger class={buttonClass}>Back</Steps.PrevTrigger>
					<Steps.NextTrigger class={buttonClass}>Next</Steps.NextTrigger>
				</div>
			</Steps.Root>
		</div>
	),
});

/** Vertical orientation, useful for sidebars. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<div class="flex w-[480px] gap-8 font-sans">
			<Steps.Root count={3} orientation="vertical">
				<Steps.List class={listVerticalClass}>
					<For each={STEP_TITLES}>
						{(title, index) => (
							<Steps.Item index={index()} class={itemVerticalClass}>
								<Steps.Trigger class={triggerClass}>
									<StepIndicator index={index()} />
									<span class={labelClass}>{title}</span>
								</Steps.Trigger>
								{index() < STEP_TITLES.length - 1 && (
									<Steps.Separator class={separatorVerticalClass} />
								)}
							</Steps.Item>
						)}
					</For>
				</Steps.List>

				<div class="flex-1">
					<Steps.Content index={0} class={contentClass}>
						Create your account by choosing a username and password.
					</Steps.Content>
					<Steps.Content index={1} class={contentClass}>
						Tell us a bit about yourself.
					</Steps.Content>
					<Steps.Content index={2} class={contentClass}>
						Review your details and confirm.
					</Steps.Content>
					<Steps.CompletedContent class={contentClass}>
						🎉 All steps completed — you're all set!
					</Steps.CompletedContent>

					<div class="mt-4 flex justify-between">
						<Steps.PrevTrigger class={buttonClass}>Back</Steps.PrevTrigger>
						<Steps.NextTrigger class={buttonClass}>Next</Steps.NextTrigger>
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
			<div class="w-[480px] font-sans">
				<Steps.Root count={4} value={value()} onChange={setValue}>
					<div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
						<Steps.Progress class="h-full bg-blue-500 transition-[width]" />
					</div>

					<Steps.List class={`${listClass} mt-4`}>
						<For each={Array.from({ length: 4 })}>
							{(_, index) => (
								<Steps.Item index={index()} class={itemClass}>
									<Steps.Trigger class={triggerClass}>
										<StepIndicator index={index()} />
									</Steps.Trigger>
									{index() < 3 && <Steps.Separator class={separatorClass} />}
								</Steps.Item>
							)}
						</For>
					</Steps.List>

					<div class="mt-4 flex items-center justify-between">
						<Steps.PrevTrigger class={buttonClass}>Back</Steps.PrevTrigger>
						<p class="text-sm text-slate-500">Step {value() + 1} of 4</p>
						<Steps.NextTrigger class={buttonClass}>Next</Steps.NextTrigger>
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
			<div class="w-[480px] font-sans">
				<Steps.Root
					count={3}
					linear
					isStepValid={isStepValid}
					onStepInvalid={() => setInvalidMessage("Enter a valid email first.")}
					onChange={() => setInvalidMessage(null)}
				>
					<Steps.List class={listClass}>
						<For each={STEP_TITLES}>
							{(title, index) => (
								<Steps.Item index={index()} class={itemClass}>
									<Steps.Trigger class={triggerClass}>
										<StepIndicator index={index()} />
										<span class={labelClass}>{title}</span>
									</Steps.Trigger>
									{index() < STEP_TITLES.length - 1 && (
										<Steps.Separator class={separatorClass} />
									)}
								</Steps.Item>
							)}
						</For>
					</Steps.List>

					<Steps.Content index={0} class={contentClass}>
						<label class="flex flex-col gap-1">
							Email address
							<input
								type="email"
								value={email()}
								onInput={(e) => setEmail(e.currentTarget.value)}
								class="rounded border border-slate-300 px-2 py-1"
								placeholder="you@example.com"
							/>
						</label>
					</Steps.Content>
					<Steps.Content index={1} class={contentClass}>
						Tell us a bit about yourself.
					</Steps.Content>
					<Steps.Content index={2} class={contentClass}>
						Review your details and confirm.
					</Steps.Content>
					<Steps.CompletedContent class={contentClass}>
						🎉 All steps completed — you're all set!
					</Steps.CompletedContent>

					{invalidMessage() && (
						<p class="mt-2 text-sm text-red-600">{invalidMessage()}</p>
					)}

					<div class="mt-4 flex justify-between">
						<Steps.PrevTrigger class={buttonClass}>Back</Steps.PrevTrigger>
						<Steps.NextTrigger class={buttonClass}>Next</Steps.NextTrigger>
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
		<div class="w-[480px] font-sans">
			<Steps.Root count={4} isStepSkippable={(index) => index === 2}>
				<Steps.List class={listClass}>
					<For each={Array.from({ length: 4 })}>
						{(_, index) => (
							<Steps.Item index={index()} class={itemClass}>
								<Steps.Trigger class={triggerClass}>
									<StepIndicator index={index()} />
								</Steps.Trigger>
								{index() < 3 && <Steps.Separator class={separatorClass} />}
							</Steps.Item>
						)}
					</For>
				</Steps.List>

				<Steps.Content index={0} class={contentClass}>
					Step 1 (normal)
				</Steps.Content>
				<Steps.Content index={1} class={contentClass}>
					Step 2 (normal)
				</Steps.Content>
				<Steps.Content index={2} class={contentClass}>
					Step 3 — skippable, only reachable by clicking its trigger directly.
				</Steps.Content>
				<Steps.Content index={3} class={contentClass}>
					Step 4 (normal)
				</Steps.Content>
				<Steps.CompletedContent class={contentClass}>
					All done!
				</Steps.CompletedContent>

				<div class="mt-4 flex justify-between">
					<Steps.PrevTrigger class={buttonClass}>Back</Steps.PrevTrigger>
					<Steps.NextTrigger class={buttonClass}>Next</Steps.NextTrigger>
				</div>
			</Steps.Root>
		</div>
	),
});

/** Controlled `value`/`onChange`, with a reset button using `useStepsContext`. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => {
		const [value, setValue] = createSignal(0);

		return (
			<div class="flex w-[480px] flex-col gap-2 font-sans">
				<Steps.Root count={3} value={value()} onChange={setValue}>
					<Steps.List class={listClass}>
						<For each={STEP_TITLES}>
							{(title, index) => (
								<Steps.Item index={index()} class={itemClass}>
									<Steps.Trigger class={triggerClass}>
										<StepIndicator index={index()} />
										<span class={labelClass}>{title}</span>
									</Steps.Trigger>
									{index() < STEP_TITLES.length - 1 && (
										<Steps.Separator class={separatorClass} />
									)}
								</Steps.Item>
							)}
						</For>
					</Steps.List>

					<Steps.CompletedContent class={contentClass}>
						All done!
					</Steps.CompletedContent>

					<div class="mt-4 flex justify-between">
						<Steps.PrevTrigger class={buttonClass}>Back</Steps.PrevTrigger>
						<button class={buttonClass} onClick={() => setValue(0)}>
							Reset
						</button>
						<Steps.NextTrigger class={buttonClass}>Next</Steps.NextTrigger>
					</div>
				</Steps.Root>
				<p class="text-sm text-slate-500">Current step index: {value()}</p>
			</div>
		);
	},
});
