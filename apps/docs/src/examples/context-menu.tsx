import { ContextMenu } from "@kobalte/core";
import { createSignal } from "solid-js";

import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "../components";
import style from "./context-menu.module.css";

export function BasicExample() {
  const [showGitLog, setShowGitLog] = createSignal(true);
  const [showHistory, setShowHistory] = createSignal(false);
  const [branch, setBranch] = createSignal("main");

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger class={style["context-menu__trigger"]}>
        Right click here.
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content class={style["context-menu__content"]}>
          <ContextMenu.Item class={style["context-menu__item"]}>
            Commit <div class={style["context-menu__item-right-slot"]}>⌘+K</div>
          </ContextMenu.Item>
          <ContextMenu.Item class={style["context-menu__item"]}>
            Push <div class={style["context-menu__item-right-slot"]}>⇧+⌘+K</div>
          </ContextMenu.Item>
          <ContextMenu.Item class={style["context-menu__item"]} disabled>
            Update Project <div class={style["context-menu__item-right-slot"]}>⌘+T</div>
          </ContextMenu.Item>
          <ContextMenu.Sub overlap gutter={4} shift={-8}>
            <ContextMenu.SubTrigger class={style["context-menu__sub-trigger"]}>
              GitHub
              <div class={style["context-menu__item-right-slot"]}>
                <ChevronRightIcon width={20} height={20} />
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent class={style["context-menu__sub-content"]}>
                <ContextMenu.Item class={style["context-menu__item"]}>
                  Create Pull Request…
                </ContextMenu.Item>
                <ContextMenu.Item class={style["context-menu__item"]}>
                  View Pull Requests
                </ContextMenu.Item>
                <ContextMenu.Item class={style["context-menu__item"]}>Sync Fork</ContextMenu.Item>
                <ContextMenu.Separator class={style["context-menu__separator"]} />
                <ContextMenu.Item class={style["context-menu__item"]}>
                  Open on GitHub
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Separator class={style["context-menu__separator"]} />

          <ContextMenu.CheckboxItem
            class={style["context-menu__checkbox-item"]}
            checked={showGitLog()}
            onChange={setShowGitLog}
          >
            <ContextMenu.ItemIndicator class={style["context-menu__item-indicator"]}>
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show Git Log
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            class={style["context-menu__checkbox-item"]}
            checked={showHistory()}
            onChange={setShowHistory}
          >
            <ContextMenu.ItemIndicator class={style["context-menu__item-indicator"]}>
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show History
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator class={style["context-menu__separator"]} />

          <ContextMenu.Group>
            <ContextMenu.GroupLabel class={style["context-menu__group-label"]}>
              Branches
            </ContextMenu.GroupLabel>
            <ContextMenu.RadioGroup value={branch()} onChange={setBranch}>
              <ContextMenu.RadioItem class={style["context-menu__radio-item"]} value="main">
                <ContextMenu.ItemIndicator class={style["context-menu__item-indicator"]}>
                  <DotFilledIcon />
                </ContextMenu.ItemIndicator>
                main
              </ContextMenu.RadioItem>
              <ContextMenu.RadioItem class={style["context-menu__radio-item"]} value="develop">
                <ContextMenu.ItemIndicator class={style["context-menu__item-indicator"]}>
                  <DotFilledIcon />
                </ContextMenu.ItemIndicator>
                develop
              </ContextMenu.RadioItem>
            </ContextMenu.RadioGroup>
          </ContextMenu.Group>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
