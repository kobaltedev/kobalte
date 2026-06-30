import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	CloseButton,
	Description,
	List,
	ProgressFill,
	ProgressTrack,
	Region,
	Root,
	Title,
	type ToastSwipeDirection,
	toaster,
} from "../index";

const meta = preview.meta({
	title: "Components/Toast",
	tags: ["autodocs"],
	argTypes: {
		duration: { control: { type: "number", min: 1000, max: 10000, step: 500 } },
		swipeDirection: {
			control: "select",
			options: ["up", "down", "left", "right"] as ToastSwipeDirection[],
		},
	},
	args: {
		duration: 5000,
		swipeDirection: "right" as ToastSwipeDirection,
	},
});

export default meta;

const regionClass =
	"fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-h-screen w-[360px] pointer-events-none";

const toastClass =
	"relative flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4 shadow-lg pointer-events-auto font-sans";

const titleClass = "text-sm font-semibold text-slate-900";
const descClass = "text-xs text-slate-500";
const closeClass =
	"absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-xs";
const buttonClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

/** Simple toast with title and description. Duration and swipe direction are controllable. */
export const Default = meta.story({
	name: "Default",
	args: { duration: 5000, swipeDirection: "right" as ToastSwipeDirection },
	render: (args) => {
		const duration = args.duration as number;
		const swipeDirection = args.swipeDirection as ToastSwipeDirection;
		return (
			<div class="font-sans">
				<Region
					class={regionClass}
					duration={duration}
					swipeDirection={swipeDirection}
				>
					<List />
				</Region>
				<button
					class={buttonClass}
					onClick={() =>
						toaster.show((props) => (
							<Root toastId={props.toastId} class={toastClass}>
								<Title class={titleClass}>Notification</Title>
								<Description class={descClass}>
									Your changes have been saved.
								</Description>
								<CloseButton class={closeClass} aria-label="Dismiss">
									✕
								</CloseButton>
							</Root>
						))
					}
				>
					Show toast
				</button>
			</div>
		);
	},
});

/** Different semantic variants — success, error, warning, info. */
export const Variants = meta.story({
	name: "Variants",
	render: () => {
		type Variant = { label: string; icon: string; color: string; bg: string };
		const variants: Variant[] = [
			{
				label: "Success",
				icon: "✓",
				color: "text-green-600",
				bg: "bg-green-50 border-green-200",
			},
			{
				label: "Error",
				icon: "✗",
				color: "text-red-600",
				bg: "bg-red-50 border-red-200",
			},
			{
				label: "Warning",
				icon: "⚠",
				color: "text-amber-600",
				bg: "bg-amber-50 border-amber-200",
			},
			{
				label: "Info",
				icon: "ℹ",
				color: "text-blue-600",
				bg: "bg-blue-50 border-blue-200",
			},
		];

		return (
			<div class="font-sans flex flex-col gap-2">
				<Region class={regionClass}>
					<List />
				</Region>
				<div class="flex gap-2 flex-wrap">
					{variants.map((v) => (
						<button
							class={buttonClass}
							onClick={() =>
								toaster.show((props) => (
									<Root
										toastId={props.toastId}
										class={`relative flex items-start gap-3 rounded-lg border p-4 shadow-lg pointer-events-auto font-sans ${v.bg}`}
									>
										<span class={`text-lg font-bold ${v.color}`}>{v.icon}</span>
										<div class="flex flex-col gap-0.5 min-w-0">
											<Title class={`text-sm font-semibold ${v.color}`}>
												{v.label}
											</Title>
											<Description class="text-xs text-slate-600">
												This is a {v.label.toLowerCase()} message.
											</Description>
										</div>
										<CloseButton class={closeClass} aria-label="Dismiss">
											✕
										</CloseButton>
									</Root>
								))
							}
						>
							{v.label}
						</button>
					))}
				</div>
			</div>
		);
	},
});

/** Toast with a visual progress bar that depletes over the duration. */
export const WithProgress = meta.story({
	name: "With Progress",
	args: { duration: 5000 },
	render: (args) => {
		const duration = args.duration as number;
		return (
			<div class="font-sans">
				<Region class={regionClass} duration={duration}>
					<List />
				</Region>
				<button
					class={buttonClass}
					onClick={() =>
						toaster.show((props) => (
							<Root toastId={props.toastId} class={toastClass}>
								<Title class={titleClass}>Uploading…</Title>
								<Description class={descClass}>
									Your file is being uploaded.
								</Description>
								<CloseButton class={closeClass} aria-label="Dismiss">
									✕
								</CloseButton>
								<ProgressTrack class="mt-2 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
									<ProgressFill
										class="h-full rounded-full bg-blue-500 transition-[width]"
										style={{ width: "var(--kb-toast-progress-fill-width)" }}
									/>
								</ProgressTrack>
							</Root>
						))
					}
				>
					Show with progress
				</button>
			</div>
		);
	},
});

/** Persistent toast that only closes via the close button — no auto-dismiss. */
export const Persistent = meta.story({
	name: "Persistent",
	render: () => (
		<div class="font-sans">
			<Region class={regionClass}>
				<List />
			</Region>
			<button
				class={buttonClass}
				onClick={() =>
					toaster.show((props) => (
						<Root toastId={props.toastId} class={toastClass} persistent>
							<Title class={titleClass}>Action required</Title>
							<Description class={descClass}>
								This toast will not auto-dismiss. Close it manually.
							</Description>
							<CloseButton class={closeClass} aria-label="Dismiss">
								✕
							</CloseButton>
						</Root>
					))
				}
			>
				Show persistent toast
			</button>
		</div>
	),
});

/** Promise-based toast: pending → fulfilled → rejected states. */
export const PromiseBased = meta.story({
	name: "Promise-based",
	render: () => {
		const [shouldFail, setShouldFail] = createSignal(false);

		return (
			<div class="flex flex-col gap-3 font-sans">
				<Region class={regionClass}>
					<List />
				</Region>
				<div class="flex items-center gap-3">
					<label class="flex items-center gap-1.5 text-sm text-slate-600">
						<input
							type="checkbox"
							checked={shouldFail()}
							onChange={(e) => setShouldFail(e.currentTarget.checked)}
						/>
						Simulate failure
					</label>
					<button
						class={buttonClass}
						onClick={() => {
							const p = new Promise<string>((resolve, reject) =>
								setTimeout(
									() =>
										shouldFail()
											? reject(new Error("Upload failed"))
											: resolve("file.pdf"),
									2000,
								),
							);
							toaster.promise(p, (props) => (
								<Root toastId={props.toastId} class={toastClass}>
									<Title class={titleClass}>
										{props.state === "pending"
											? "Uploading…"
											: props.state === "fulfilled"
												? `Done — ${props.data as string}`
												: `Error — ${(props.error as Error)?.message}`}
									</Title>
									<CloseButton class={closeClass} aria-label="Dismiss">
										✕
									</CloseButton>
								</Root>
							));
						}}
					>
						Start upload
					</button>
				</div>
			</div>
		);
	},
});

/** Multiple toasts stacking — limit controls max visible at once. */
export const Stacking = meta.story({
	name: "Stacking",
	render: () => {
		const limit = 3;
		let count = 0;
		return (
			<div class="font-sans">
				<Region class={regionClass} limit={limit}>
					<List />
				</Region>
				<button
					class={buttonClass}
					onClick={() => {
						count++;
						const n = count;
						toaster.show((props) => (
							<Root toastId={props.toastId} class={toastClass}>
								<Title class={titleClass}>Toast #{n}</Title>
								<Description class={descClass}>
									Visible up to {limit} at a time.
								</Description>
								<CloseButton class={closeClass} aria-label="Dismiss">
									✕
								</CloseButton>
							</Root>
						));
					}}
				>
					Add toast
				</button>
			</div>
		);
	},
});
