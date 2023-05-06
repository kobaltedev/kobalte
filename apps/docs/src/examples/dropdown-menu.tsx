import { DropdownMenu } from "@kobalte/core";
import { createSignal } from "solid-js";

import { CheckIcon, ChevronDownIcon, ChevronRightIcon, DotFilledIcon } from "../components";
import style from "./dropdown-menu.module.css";

export function BasicExample() {
  const [showGitLog, setShowGitLog] = createSignal(true);
  const [showHistory, setShowHistory] = createSignal(false);
  const [branch, setBranch] = createSignal("main");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class={style["dropdown-menu__trigger"]}>
        <span>Git Settings</span>
        <DropdownMenu.Icon class={style["dropdown-menu__trigger-icon"]}>
          <ChevronDownIcon />
        </DropdownMenu.Icon>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class={style["dropdown-menu__content"]}>
          <DropdownMenu.Item class={style["dropdown-menu__item"]}>
            Commit <div class={style["dropdown-menu__item-right-slot"]}>⌘+K</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item class={style["dropdown-menu__item"]}>
            Push <div class={style["dropdown-menu__item-right-slot"]}>⇧+⌘+K</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item class={style["dropdown-menu__item"]} disabled>
            Update Project <div class={style["dropdown-menu__item-right-slot"]}>⌘+T</div>
          </DropdownMenu.Item>
          <DropdownMenu.Sub overlap gutter={4} shift={-8}>
            <DropdownMenu.SubTrigger class={style["dropdown-menu__sub-trigger"]}>
              GitHub
              <div class={style["dropdown-menu__item-right-slot"]}>
                <ChevronRightIcon width={20} height={20} />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent class={style["dropdown-menu__sub-content"]}>
                <DropdownMenu.Item class={style["dropdown-menu__item"]}>
                  Create Pull Request…
                </DropdownMenu.Item>
                <DropdownMenu.Item class={style["dropdown-menu__item"]}>
                  View Pull Requests
                </DropdownMenu.Item>
                <DropdownMenu.Item class={style["dropdown-menu__item"]}>
                  Sync Fork
                </DropdownMenu.Item>
                <DropdownMenu.Separator class={style["dropdown-menu__separator"]} />
                <DropdownMenu.Item class={style["dropdown-menu__item"]}>
                  Open on GitHub
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator class={style["dropdown-menu__separator"]} />

          <DropdownMenu.CheckboxItem
            class={style["dropdown-menu__checkbox-item"]}
            checked={showGitLog()}
            onChange={setShowGitLog}
          >
            <DropdownMenu.ItemIndicator class={style["dropdown-menu__item-indicator"]}>
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Git Log
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            class={style["dropdown-menu__checkbox-item"]}
            checked={showHistory()}
            onChange={setShowHistory}
          >
            <DropdownMenu.ItemIndicator class={style["dropdown-menu__item-indicator"]}>
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show History
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator class={style["dropdown-menu__separator"]} />

          <DropdownMenu.Group>
            <DropdownMenu.GroupLabel class={style["dropdown-menu__group-label"]}>
              Branches
            </DropdownMenu.GroupLabel>
            <DropdownMenu.RadioGroup value={branch()} onChange={setBranch}>
              <DropdownMenu.RadioItem class={style["dropdown-menu__radio-item"]} value="main">
                <DropdownMenu.ItemIndicator class={style["dropdown-menu__item-indicator"]}>
                  <DotFilledIcon />
                </DropdownMenu.ItemIndicator>
                main
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem class={style["dropdown-menu__radio-item"]} value="develop">
                <DropdownMenu.ItemIndicator class={style["dropdown-menu__item-indicator"]}>
                  <DotFilledIcon />
                </DropdownMenu.ItemIndicator>
                develop
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Group>

          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function ControlledExample() {
  const [open, setOpen] = createSignal(false);

  return (
    <DropdownMenu.Root open={open()} onOpenChange={setOpen} gutter={8}>
      <DropdownMenu.Trigger class={style["dropdown-menu__trigger"]}>
        {open() ? "Close" : "Open"}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class={style["dropdown-menu__content"]}>
          <DropdownMenu.Item class={style["dropdown-menu__item"]}>New Tab</DropdownMenu.Item>
          <DropdownMenu.Item class={style["dropdown-menu__item"]}>New Window</DropdownMenu.Item>
          <DropdownMenu.Item class={style["dropdown-menu__item"]}>
            New Private Window
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
