import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Fallback, Img, Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Image",
	tags: ["autodocs"],
});

export default meta;

/** Loads a valid image — fallback never appears. */
export const Loaded = meta.story({
	name: "Loaded",
	render: () => (
		<Root class={style.image__root}>
			<Img
				class={style.image__img}
				src="https://i.pravatar.cc/48?img=3"
				alt="User avatar"
			/>
			<Fallback class={style.image__fallback}>AB</Fallback>
		</Root>
	),
});

/** Broken src forces the fallback to display immediately. */
export const Fallback_ = meta.story({
	name: "Fallback",
	render: () => (
		<Root class={style.image__root}>
			<Img
				class={style.image__img}
				src="https://broken-image-url.example/avatar.jpg"
				alt="User avatar"
			/>
			<Fallback
				class={[style.image__fallback, style["image__fallback-indigo"]]}
			>
				JD
			</Fallback>
		</Root>
	),
});

/** `fallbackDelay` (ms) delays the fallback so fast loads don't flash it. */
export const FallbackDelay = meta.story({
	name: "Fallback Delay",
	render: () => (
		<Root class={style.image__root} fallbackDelay={1500}>
			<Img
				class={style.image__img}
				src="https://broken-image-url.example/avatar.jpg"
				alt="User avatar"
			/>
			<Fallback class={[style.image__fallback, style["image__fallback-amber"]]}>
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
			<div class={style.image__group}>
				{users.map((u) => (
					<Root class={[style.image__root, style.image__ring]}>
						<Img class={style.image__img} src={u.src} alt={u.initials} />
						<Fallback
							class={[style.image__fallback, style["image__fallback-sm"]]}
						>
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
		<div class={style.image__col}>
			<Root class={style.image__root} onLoadingStatusChange={setStatus}>
				<Img
					class={style.image__img}
					src="https://i.pravatar.cc/48?img=8"
					alt="User"
				/>
				<Fallback class={style.image__fallback}>US</Fallback>
			</Root>
			<p class={style["image__status-text"]}>
				Status: <strong>{status()}</strong>
			</p>
		</div>
	);
}

export const LoadingStatus = meta.story({
	name: "Loading Status",
	render: () => <StatusDemo />,
});
