import { DropdownMenu } from "@kobalte/core";
import { createSignal } from "solid-js";

import { CheckIcon, ChevronDownIcon, ChevronRightIcon, DotFilledIcon } from "../components";
import style from "./dropdown-menu.module.css";

export function BasicExample() {
  const [showGitLog, setShowGitLog] = createSignal(true);
  const [showHistory, setShowHistory] = createSignal(false);
  const [branch, setBranch] = createSignal("main");

  const handleAction = (key: string) => {
    alert(key);
  };

  return (
    <DropdownMenu onAction={handleAction}>
      <DropdownMenu.Trigger class={style["dropdown-menu__trigger"]}>
        <span>Git Settings</span>
        <DropdownMenu.Icon class={style["dropdown-menu__trigger-icon"]}>
          <ChevronDownIcon />
        </DropdownMenu.Icon>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class={style["dropdown-menu__content"]}>
          <DropdownMenu.Item key="commit" class={style["dropdown-menu__item"]}>
            Commit <div class={style["dropdown-menu__item-right-slot"]}>⌘+K</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="push" class={style["dropdown-menu__item"]}>
            Push <div class={style["dropdown-menu__item-right-slot"]}>⇧+⌘+K</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="update-project" class={style["dropdown-menu__item"]} isDisabled>
            Update Project <div class={style["dropdown-menu__item-right-slot"]}>⌘+T</div>
          </DropdownMenu.Item>
          <DropdownMenu.Sub gutter={4} shift={-8}>
            <DropdownMenu.SubTrigger key="github" class={style["dropdown-menu__sub-trigger"]}>
              GitHub
              <div class={style["dropdown-menu__item-right-slot"]}>
                <ChevronRightIcon width={20} height={20} />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent class={style["dropdown-menu__sub-content"]}>
                <DropdownMenu.Item key="create-pull-request" class={style["dropdown-menu__item"]}>
                  Create Pull Request…
                </DropdownMenu.Item>
                <DropdownMenu.Item key="view-pull-requests" class={style["dropdown-menu__item"]}>
                  View Pull Requests
                </DropdownMenu.Item>
                <DropdownMenu.Item key="sync-fork" class={style["dropdown-menu__item"]}>
                  Sync Fork
                </DropdownMenu.Item>
                <DropdownMenu.Separator class={style["dropdown-menu__separator"]} />
                <DropdownMenu.Item key="open-on-github" class={style["dropdown-menu__item"]}>
                  Open on GitHub
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator class={style["dropdown-menu__separator"]} />

          <DropdownMenu.CheckboxItem
            key="show-git-log"
            class={style["dropdown-menu__checkbox-item"]}
            isChecked={showGitLog()}
            onCheckedChange={setShowGitLog}
          >
            <DropdownMenu.ItemIndicator class={style["dropdown-menu__item-indicator"]}>
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Git Log
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            key="show-history"
            class={style["dropdown-menu__checkbox-item"]}
            isChecked={showHistory()}
            onCheckedChange={setShowHistory}
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
            <DropdownMenu.RadioGroup value={branch()} onValueChange={setBranch}>
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
    </DropdownMenu>
  );
}

export function ControlledExample() {
  const [open, setOpen] = createSignal(false);

  return (
    <DropdownMenu isOpen={open()} onOpenChange={setOpen} gutter={8}>
      <DropdownMenu.Trigger class={style["dropdown-menu__trigger"]}>
        {open() ? "Close" : "Open"}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class={style["dropdown-menu__content"]}>
          <DropdownMenu.Item key="new-tab" class={style["dropdown-menu__item"]}>
            New Tab
          </DropdownMenu.Item>
          <DropdownMenu.Item key="new-window" class={style["dropdown-menu__item"]}>
            New Window
          </DropdownMenu.Item>
          <DropdownMenu.Item key="new-private-window" class={style["dropdown-menu__item"]}>
            New Private Window
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}
