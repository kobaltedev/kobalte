import { Menubar } from "@kobalte/core";
import { createSignal } from "solid-js";

import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "../components";
import style from "./menubar.module.css";

export function BasicExample() {
	const [showGitLog, setShowGitLog] = createSignal(true);
	const [showHistory, setShowHistory] = createSignal(false);
	const [branch, setBranch] = createSignal("main");

	return (
		<Menubar.Root class={style.menubar__root}>
			<Menubar.Menu>
				<Menubar.Trigger class={style.menubar__trigger}>Git</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content class={style.menubar__content}>
						<Menubar.Item class={style.menubar__item}>
							Commit <div class={style["menubar__item-right-slot"]}>⌘+K</div>
						</Menubar.Item>
						<Menubar.Item class={style.menubar__item}>
							Push <div class={style["menubar__item-right-slot"]}>⇧+⌘+K</div>
						</Menubar.Item>
						<Menubar.Item class={style.menubar__item} disabled>
							Update Project{" "}
							<div class={style["menubar__item-right-slot"]}>⌘+T</div>
						</Menubar.Item>
						<Menubar.Sub overlap gutter={4} shift={-8}>
							<Menubar.SubTrigger class={style["menubar__sub-trigger"]}>
								GitHub
								<div class={style["menubar__item-right-slot"]}>
									<ChevronRightIcon width={20} height={20} />
								</div>
							</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent class={style["menubar__sub-content"]}>
									<Menubar.Item class={style.menubar__item}>
										Create Pull Request…
									</Menubar.Item>
									<Menubar.Item class={style.menubar__item}>
										View Pull Requests
									</Menubar.Item>
									<Menubar.Item class={style.menubar__item}>
										Sync Fork
									</Menubar.Item>
									<Menubar.Separator class={style.menubar__separator} />
									<Menubar.Item class={style.menubar__item}>
										Open on GitHub
									</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>

						<Menubar.Separator class={style.menubar__separator} />

						<Menubar.CheckboxItem
							class={style["menubar__checkbox-item"]}
							checked={showGitLog()}
							onChange={setShowGitLog}
						>
							<Menubar.ItemIndicator class={style["menubar__item-indicator"]}>
								<CheckIcon />
							</Menubar.ItemIndicator>
							Show Git Log
						</Menubar.CheckboxItem>
						<Menubar.CheckboxItem
							class={style["menubar__checkbox-item"]}
							checked={showHistory()}
							onChange={setShowHistory}
						>
							<Menubar.ItemIndicator class={style["menubar__item-indicator"]}>
								<CheckIcon />
							</Menubar.ItemIndicator>
							Show History
						</Menubar.CheckboxItem>

						<Menubar.Separator class={style.menubar__separator} />

						<Menubar.Group>
							<Menubar.GroupLabel class={style["menubar__group-label"]}>
								Branches
							</Menubar.GroupLabel>
							<Menubar.RadioGroup value={branch()} onChange={setBranch}>
								<Menubar.RadioItem
									class={style["menubar__radio-item"]}
									value="main"
								>
									<Menubar.ItemIndicator
										class={style["menubar__item-indicator"]}
									>
										<DotFilledIcon />
									</Menubar.ItemIndicator>
									main
								</Menubar.RadioItem>
								<Menubar.RadioItem
									class={style["menubar__radio-item"]}
									value="develop"
								>
									<Menubar.ItemIndicator
										class={style["menubar__item-indicator"]}
									>
										<DotFilledIcon />
									</Menubar.ItemIndicator>
									develop
								</Menubar.RadioItem>
							</Menubar.RadioGroup>
						</Menubar.Group>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger class={style.menubar__trigger}>File</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content class={style.menubar__content}>
						<Menubar.Item class={style.menubar__item}>
							New Tab <div class={style["menubar__item-right-slot"]}>⌘+T</div>
						</Menubar.Item>
						<Menubar.Item class={style.menubar__item}>
							New Window{" "}
							<div class={style["menubar__item-right-slot"]}>⌘+N</div>
						</Menubar.Item>
						<Menubar.Item class={style.menubar__item} disabled>
							New Incognito Window
						</Menubar.Item>

						<Menubar.Separator class={style.menubar__separator} />

						<Menubar.Sub overlap gutter={4} shift={-8}>
							<Menubar.SubTrigger class={style["menubar__sub-trigger"]}>
								Share
								<div class={style["menubar__item-right-slot"]}>
									<ChevronRightIcon width={20} height={20} />
								</div>
							</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent class={style["menubar__sub-content"]}>
									<Menubar.Item class={style.menubar__item}>
										Email Link
									</Menubar.Item>
									<Menubar.Item class={style.menubar__item}>
										Messages
									</Menubar.Item>
									<Menubar.Item class={style.menubar__item}>Notes</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>

						<Menubar.Separator class={style.menubar__separator} />

						<Menubar.Item class={style.menubar__item}>
							Print... <div class={style["menubar__item-right-slot"]}>⌘+P</div>
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger class={style.menubar__trigger}>Edit</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content class={style.menubar__content}>
						<Menubar.Item class={style.menubar__item}>
							Undo <div class={style["menubar__item-right-slot"]}>⌘+Z</div>
						</Menubar.Item>
						<Menubar.Item class={style.menubar__item}>
							Redo <div class={style["menubar__item-right-slot"]}>⇧+⌘+Z</div>
						</Menubar.Item>

						<Menubar.Separator class={style.menubar__separator} />

						<Menubar.Sub overlap gutter={4} shift={-8}>
							<Menubar.SubTrigger class={style["menubar__sub-trigger"]}>
								Find
								<div class={style["menubar__item-right-slot"]}>
									<ChevronRightIcon width={20} height={20} />
								</div>
							</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent class={style["menubar__sub-content"]}>
									<Menubar.Item class={style.menubar__item}>
										Search The Web
									</Menubar.Item>
									<Menubar.Separator class={style.menubar__separator} />
									<Menubar.Item class={style.menubar__item}>
										Find...
									</Menubar.Item>
									<Menubar.Item class={style.menubar__item}>
										Find Next
									</Menubar.Item>
									<Menubar.Item class={style.menubar__item}>
										Find Previous
									</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>

						<Menubar.Separator class={style.menubar__separator} />

						<Menubar.Item class={style.menubar__item}>Cut</Menubar.Item>
						<Menubar.Item class={style.menubar__item}>Copy</Menubar.Item>
						<Menubar.Item class={style.menubar__item}>Paste</Menubar.Item>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>
		</Menubar.Root>
	);
}
