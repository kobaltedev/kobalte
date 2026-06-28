import { createSignal } from "solid-js";

import { Drawer } from "@kobalte/core/drawer";
import { CrossIcon } from "../components";
import style from "./drawer.module.css";

export function BasicExample() {
	return (
		<Drawer side="bottom">
			<Drawer.Trigger class={style.drawer__trigger}>Open drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay class={style.drawer__overlay} />
				<Drawer.Content class={style.drawer__content}>
					<div class={style.drawer__handle} />
					<div class={style.drawer__header}>
						<Drawer.Title class={style.drawer__title}>Drawer</Drawer.Title>
						<Drawer.CloseButton class={style["drawer__close-button"]}>
							<CrossIcon />
						</Drawer.CloseButton>
					</div>
					<Drawer.Description class={style.drawer__description}>
						Drag the handle or swipe down to dismiss. The overlay opacity and
						drawer position both track your finger in real time.
					</Drawer.Description>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer>
	);
}

export function SnapPointsExample() {
	return (
		<Drawer side="bottom" snapPoints={[0, 0.4, 1]} defaultSnapPoint={0.4}>
			<Drawer.Trigger class={style.drawer__trigger}>
				Open with snap points
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay class={style.drawer__overlay} />
				<Drawer.Content
					class={style.drawer__content}
					style={{ height: "70vh" }}
				>
					<div class={style.drawer__handle} />
					<div class={style.drawer__header}>
						<Drawer.Title class={style.drawer__title}>Snap points</Drawer.Title>
						<Drawer.CloseButton class={style["drawer__close-button"]}>
							<CrossIcon />
						</Drawer.CloseButton>
					</div>
					<Drawer.Description class={style.drawer__description}>
						This drawer has three snap points: <strong>closed</strong>,{" "}
						<strong>peek (40%)</strong>, and <strong>expanded (100%)</strong>.
						Drag to snap between them.
					</Drawer.Description>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer>
	);
}

export function ControlledExample() {
	const [open, setOpen] = createSignal(false);

	return (
		<div class={style.controlled__root}>
			<Drawer side="right" open={open()} onOpenChange={setOpen}>
				<Drawer.Trigger class={style.drawer__trigger}>
					Open settings
				</Drawer.Trigger>
				<Drawer.Portal>
					<Drawer.Overlay class={style.drawer__overlay} />
					<Drawer.Content class={style.drawer__content_right}>
						<div class={style.drawer__header}>
							<Drawer.Title class={style.drawer__title}>Settings</Drawer.Title>
							<Drawer.CloseButton class={style["drawer__close-button"]}>
								<CrossIcon />
							</Drawer.CloseButton>
						</div>
						<Drawer.Description class={style.drawer__description}>
							Open state is controlled by an external signal.
						</Drawer.Description>
						<div class={style.controlled__actions}>
							<button
								class={style.drawer__action}
								onClick={() => setOpen(false)}
							>
								Done
							</button>
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer>
			<button
				class={style.drawer__trigger}
				onClick={() => setOpen((o) => !o)}
			>
				{open() ? "Force close" : "Force open"}
			</button>
		</div>
	);
}
