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
} from "../index.tsx";
import style from "./stories.module.css";

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

export const Default = meta.story({
	name: "Default",
	args: { duration: 5000, swipeDirection: "right" as ToastSwipeDirection },
	render: (args) => {
		const duration = args.duration as number;
		const swipeDirection = args.swipeDirection as ToastSwipeDirection;
		return (
			<div class={style.toastWrapper}>
				<Region
					class={style.toastRegion}
					duration={duration}
					swipeDirection={swipeDirection}
				>
					<List />
				</Region>
				<button
					type="button"
					class={style.toastButton}
					onClick={() =>
						toaster.show((props) => (
							<Root toastId={props.toastId} class={style.toastRoot}>
								<Title class={style.toastTitle}>Notification</Title>
								<Description class={style.toastDescription}>
									Your changes have been saved.
								</Description>
								<CloseButton class={style.toastClose} aria-label="Dismiss">
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

export const Variants = meta.story({
	name: "Variants",
	render: () => {
		type Variant = {
			label: string;
			icon: string;
			colorClass: string;
			bgClass: string;
		};
		const variants: Variant[] = [
			{
				label: "Success",
				icon: "✓",
				colorClass: style.toastVariantTitleSuccess,
				bgClass: style.toastVariantSuccess,
			},
			{
				label: "Error",
				icon: "✗",
				colorClass: style.toastVariantTitleError,
				bgClass: style.toastVariantError,
			},
			{
				label: "Warning",
				icon: "⚠",
				colorClass: style.toastVariantTitleWarning,
				bgClass: style.toastVariantWarning,
			},
			{
				label: "Info",
				icon: "ℹ",
				colorClass: style.toastVariantTitleInfo,
				bgClass: style.toastVariantInfo,
			},
		];

		return (
			<div class={[style.toastWrapper, style.toastWrapperGap]}>
				<Region class={style.toastRegion}>
					<List />
				</Region>
				<div class={[style.toastWrapper, style.toastWrapperFlex]}>
					{variants.map((v) => (
						<button
							type="button"
							class={style.toastButton}
							onClick={() =>
								toaster.show((props) => (
									<Root
										toastId={props.toastId}
										class={`${style.toastVariant} ${v.bgClass}`}
									>
										<span class={`${style.toastVariantIcon} ${v.colorClass}`}>
											{v.icon}
										</span>
										<div class={style.toastVariantContent}>
											<Title
												class={`${style.toastVariantTitle} ${v.colorClass}`}
											>
												{v.label}
											</Title>
											<Description class={style.toastVariantDesc}>
												This is a {v.label.toLowerCase()} message.
											</Description>
										</div>
										<CloseButton class={style.toastClose} aria-label="Dismiss">
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

export const WithProgress = meta.story({
	name: "With Progress",
	args: { duration: 5000 },
	render: (args) => {
		const duration = args.duration as number;
		return (
			<div class={style.toastWrapper}>
				<Region class={style.toastRegion} duration={duration}>
					<List />
				</Region>
				<button
					type="button"
					class={style.toastButton}
					onClick={() =>
						toaster.show((props) => (
							<Root toastId={props.toastId} class={style.toastRoot}>
								<Title class={style.toastTitle}>Uploading…</Title>
								<Description class={style.toastDescription}>
									Your file is being uploaded.
								</Description>
								<CloseButton class={style.toastClose} aria-label="Dismiss">
									✕
								</CloseButton>
								<ProgressTrack class={style.toastProgressTrack}>
									<ProgressFill class={style.toastProgressFill} />
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

export const Persistent = meta.story({
	name: "Persistent",
	render: () => (
		<div class={style.toastWrapper}>
			<Region class={style.toastRegion}>
				<List />
			</Region>
			<button
				type="button"
				class={style.toastButton}
				onClick={() =>
					toaster.show((props) => (
						<Root toastId={props.toastId} class={style.toastRoot} persistent>
							<Title class={style.toastTitle}>Action required</Title>
							<Description class={style.toastDescription}>
								This toast will not auto-dismiss. Close it manually.
							</Description>
							<CloseButton class={style.toastClose} aria-label="Dismiss">
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

export const PromiseBased = meta.story({
	name: "Promise-based",
	render: () => {
		const [shouldFail, setShouldFail] = createSignal(false);

		return (
			<div class={[style.toastWrapper, style.toastWrapperGap]}>
				<Region class={style.toastRegion}>
					<List />
				</Region>
				<div class={[style.toastWrapper, style.toastWrapperCenter]}>
					<label class={[style.toastWrapper, style.toastWrapperCenter]}>
						<input
							type="checkbox"
							checked={shouldFail()}
							onChange={(e) => setShouldFail(e.currentTarget.checked)}
						/>
						Simulate failure
					</label>
					<button
						type="button"
						class={style.toastButton}
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
								<Root toastId={props.toastId} class={style.toastRoot}>
									<Title class={style.toastTitle}>
										{props.state === "pending"
											? "Uploading…"
											: props.state === "fulfilled"
												? `Done — ${props.data as string}`
												: `Error — ${(props.error as Error)?.message}`}
									</Title>
									<CloseButton class={style.toastClose} aria-label="Dismiss">
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

export const Stacking = meta.story({
	name: "Stacking",
	render: () => {
		const limit = 3;
		let count = 0;
		return (
			<div class={style.toastWrapper}>
				<Region class={style.toastRegion} limit={limit}>
					<List />
				</Region>
				<button
					type="button"
					class={style.toastButton}
					onClick={() => {
						count++;
						const n = count;
						toaster.show((props) => (
							<Root toastId={props.toastId} class={style.toastRoot}>
								<Title class={style.toastTitle}>Toast #{n}</Title>
								<Description class={style.toastDescription}>
									Visible up to {limit} at a time.
								</Description>
								<CloseButton class={style.toastClose} aria-label="Dismiss">
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
