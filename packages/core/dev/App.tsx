import { createSignal } from "solid-js";

import { I18nProvider, DropdownMenu } from "../src";

export default function App() {
  const [showGitLog, setShowGitLog] = createSignal(true);
  const [showHistory, setShowHistory] = createSignal(false);
  const [branch, setBranch] = createSignal("main");

  return (
    <I18nProvider>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="dropdown-menu__trigger">
          <span>Git Settings</span>
          <DropdownMenu.Icon class="dropdown-menu__trigger-icon">V</DropdownMenu.Icon>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content class="dropdown-menu__content">
            <DropdownMenu.Item class="dropdown-menu__item">
              Commit <div class="dropdown-menu__item-right-slot">⌘+K</div>
            </DropdownMenu.Item>
            <DropdownMenu.Item class="dropdown-menu__item">
              Push <div class="dropdown-menu__item-right-slot">⇧+⌘+K</div>
            </DropdownMenu.Item>
            <DropdownMenu.Item class="dropdown-menu__item" isDisabled>
              Update Project <div class="dropdown-menu__item-right-slot">⌘+T</div>
            </DropdownMenu.Item>
            <DropdownMenu.Sub overlap gutter={4} shift={-8}>
              <DropdownMenu.SubTrigger class="dropdown-menu__sub-trigger">
                GitHub
                <div class="dropdown-menu__item-right-slot">&gt;</div>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent class="dropdown-menu__sub-content">
                  <DropdownMenu.Item class="dropdown-menu__item">
                    Create Pull Request…
                  </DropdownMenu.Item>
                  <DropdownMenu.Item class="dropdown-menu__item">
                    View Pull Requests
                  </DropdownMenu.Item>
                  <DropdownMenu.Item class="dropdown-menu__item">Sync Fork</DropdownMenu.Item>
                  <DropdownMenu.Separator class="dropdown-menu__separator" />
                  <DropdownMenu.Item class="dropdown-menu__item">Open on GitHub</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
            <DropdownMenu.Separator class="dropdown-menu__separator" />
            <DropdownMenu.CheckboxItem
              class="dropdown-menu__checkbox-item"
              isChecked={showGitLog()}
              onCheckedChange={setShowGitLog}
            >
              <DropdownMenu.ItemIndicator class="dropdown-menu__item-indicator">
                x
              </DropdownMenu.ItemIndicator>
              Show Git Log
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              class="dropdown-menu__checkbox-item"
              isChecked={showHistory()}
              onCheckedChange={setShowHistory}
            >
              <DropdownMenu.ItemIndicator class="dropdown-menu__item-indicator">
                x
              </DropdownMenu.ItemIndicator>
              Show History
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.Separator class="dropdown-menu__separator" />
            <DropdownMenu.Group>
              <DropdownMenu.GroupLabel class="dropdown-menu__group-label">
                Branches
              </DropdownMenu.GroupLabel>
              <DropdownMenu.RadioGroup value={branch()} onValueChange={setBranch}>
                <DropdownMenu.RadioItem class="dropdown-menu__radio-item" value="main">
                  <DropdownMenu.ItemIndicator class="dropdown-menu__item-indicator">
                    o
                  </DropdownMenu.ItemIndicator>
                  main
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem class="dropdown-menu__radio-item" value="develop">
                  <DropdownMenu.ItemIndicator class="dropdown-menu__item-indicator">
                    o
                  </DropdownMenu.ItemIndicator>
                  develop
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Group>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </I18nProvider>
  );
}
