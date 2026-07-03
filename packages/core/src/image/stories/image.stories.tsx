import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Fallback, Img, Root } from "../index";

const meta = preview.meta({
	title: "Components/Image",
	tags: ["autodocs"],
});

export default meta;

/** Loads a valid image — fallback never appears. */
export const Loaded = meta.story({
	name: "Loaded",
	render: () => (
		<Root class="inline-flex h-12 w-12 rounded-full overflow-hidden font-sans">
			<Img
				class="h-full w-full object-cover"
				src="https://i.pravatar.cc/48?img=3"
				alt="User avatar"
			/>
			<Fallback class="flex h-full w-full items-center justify-center bg-slate-200 text-slate-600 text-sm font-medium">
				AB
			</Fallback>
		</Root>
	),
});

/** Broken src forces the fallback to display immediately. */
export const Fallback_ = meta.story({
	name: "Fallback",
	render: () => (
		<Root class="inline-flex h-12 w-12 rounded-full overflow-hidden font-sans">
			<Img
				class="h-full w-full object-cover"
				src="https://broken-image-url.example/avatar.jpg"
				alt="User avatar"
			/>
			<Fallback class="flex h-full w-full items-center justify-center bg-indigo-100 text-indigo-700 text-sm font-medium">
				JD
			</Fallback>
		</Root>
	),
});

/** `fallbackDelay` (ms) delays the fallback so fast loads don't flash it. */
export const FallbackDelay = meta.story({
	name: "Fallback Delay",
	render: () => (
		<Root
			class="inline-flex h-12 w-12 rounded-full overflow-hidden font-sans"
			fallbackDelay={1500}
		>
			<Img
				class="h-full w-full object-cover"
				src="https://broken-image-url.example/avatar.jpg"
				alt="User avatar"
			/>
			<Fallback class="flex h-full w-full items-center justify-center bg-amber-100 text-amber-700 text-sm font-medium">
				DL
			</Fallback>
		</Root>
	),
});

/** A row of avatars with different initials as fallbacks. */
export const AvatarGroup = meta.story({
	name: "Avatar Group",
	render: () => {
		const users = [
			{ src: "https://i.pravatar.cc/48?img=1", initials: "AA" },
			{ src: "https://broken.example/img2.jpg", initials: "BB" },
			{ src: "https://i.pravatar.cc/48?img=5", initials: "CC" },
			{ src: "https://broken.example/img3.jpg", initials: "DD" },
		];
		return (
			<div class="flex -space-x-2 font-sans">
				{users.map((u) => (
					<Root class="inline-flex h-10 w-10 rounded-full overflow-hidden ring-2 ring-white">
						<Img
							class="h-full w-full object-cover"
							src={u.src}
							alt={u.initials}
						/>
						<Fallback class="flex h-full w-full items-center justify-center bg-slate-300 text-slate-700 text-xs font-semibold">
							{u.initials}
						</Fallback>
					</Root>
				))}
			</div>
		);
	},
});

/** `onLoadingStatusChange` reports the current image state. */
function StatusDemo() {
	const [status, setStatus] = createSignal("idle");
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root
				class="inline-flex h-12 w-12 rounded-full overflow-hidden"
				onLoadingStatusChange={setStatus}
			>
				<Img
					class="h-full w-full object-cover"
					src="https://i.pravatar.cc/48?img=8"
					alt="User"
				/>
				<Fallback class="flex h-full w-full items-center justify-center bg-slate-200 text-slate-600 text-sm font-medium">
					US
				</Fallback>
			</Root>
			<p class="text-xs text-slate-500">
				Status: <strong>{status()}</strong>
			</p>
		</div>
	);
}

export const LoadingStatus = meta.story({
	name: "Loading Status",
	render: () => <StatusDemo />,
});
