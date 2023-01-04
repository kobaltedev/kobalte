import { DropdownMenu } from "@kobalte/core";
import { createSignal } from "solid-js";

import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "../components";
import style from "./dropdown-menu.module.css";

export function BasicExample() {
  const [bookmarksChecked, setBookmarksChecked] = createSignal(true);
  const [urlsChecked, setUrlsChecked] = createSignal(false);
  const [person, setPerson] = createSignal("pedro");

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger class={style["dropdown-menu__trigger"]}>Settings</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class={style["dropdown-menu__content"]}>
          <DropdownMenu.Item key="new-tab" class={style["dropdown-menu__item"]}>
            New Tab <div class={style["dropdown-menu__item-right-slot"]}>⌘+T</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="new-window" class={style["dropdown-menu__item"]}>
            New Window <div class={style["dropdown-menu__item-right-slot"]}>⌘+N</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            key="new-private-window"
            class={style["dropdown-menu__item"]}
            isDisabled
          >
            New Private Window <div class={style["dropdown-menu__item-right-slot"]}>⇧+⌘+N</div>
          </DropdownMenu.Item>
          <DropdownMenu.Sub gutter={2} shift={-5}>
            <DropdownMenu.SubTrigger key="more-tools" class={style["dropdown-menu__sub-trigger"]}>
              More Tools
              <div class={style["dropdown-menu__item-right-slot"]}>
                <ChevronRightIcon width={20} height={20} />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent class={style["dropdown-menu__sub-content"]}>
                <DropdownMenu.Item key="save-page-as" class={style["dropdown-menu__item"]}>
                  Save Page As… <div class={style["dropdown-menu__item-right-slot"]}>⌘+S</div>
                </DropdownMenu.Item>
                <DropdownMenu.Item key="create-shortcut" class={style["dropdown-menu__item"]}>
                  Create Shortcut…
                </DropdownMenu.Item>
                <DropdownMenu.Item key="name-window" class={style["dropdown-menu__item"]}>
                  Name Window…
                </DropdownMenu.Item>
                <DropdownMenu.Separator class="DropdownMenu.Separator" />
                <DropdownMenu.Item key="developer-tools" class={style["dropdown-menu__item"]}>
                  Developer Tools
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator class={style["dropdown-menu__separator"]} />

          <DropdownMenu.CheckboxItem
            key="show-bookmarks"
            class={style["dropdown-menu__checkbox-item"]}
            isChecked={bookmarksChecked()}
            onCheckedChange={setBookmarksChecked}
          >
            <DropdownMenu.ItemIndicator class={style["dropdown-menu__item-indicator"]}>
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Bookmarks <div class={style["dropdown-menu__item-right-slot"]}>⌘+B</div>
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            key="show-full-url"
            class={style["dropdown-menu__checkbox-item"]}
            isChecked={urlsChecked()}
            onCheckedChange={setUrlsChecked}
          >
            <DropdownMenu.ItemIndicator class={style["dropdown-menu__item-indicator"]}>
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Full URLs
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator class={style["dropdown-menu__separator"]} />

          <DropdownMenu.Group>
            <DropdownMenu.GroupLabel class={style["dropdown-menu__group-label"]}>
              People
            </DropdownMenu.GroupLabel>
            <DropdownMenu.RadioGroup value={person()} onValueChange={setPerson}>
              <DropdownMenu.RadioItem class={style["dropdown-menu__radio-item"]} value="pedro">
                <DropdownMenu.ItemIndicator class={style["dropdown-menu__item-indicator"]}>
                  <DotFilledIcon />
                </DropdownMenu.ItemIndicator>
                Pedro Duarte
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem class={style["dropdown-menu__radio-item"]} value="colm">
                <DropdownMenu.ItemIndicator class={style["dropdown-menu__item-indicator"]}>
                  <DotFilledIcon />
                </DropdownMenu.ItemIndicator>
                Colm Tuite
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Group>

          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}
