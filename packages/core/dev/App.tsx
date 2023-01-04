import { ComponentProps, createSignal, splitProps } from "solid-js";

import { ContextMenu, DropdownMenu, I18nProvider, Select } from "../src";

function HamburgerMenuIcon(props: any) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" {...props}>
      <path
        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      />
    </svg>
  );
}

function DotFilledIcon(props: any) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" {...props}>
      <path
        d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon(props: any) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" {...props}>
      <path
        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      />
    </svg>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" {...props}>
      <path
        d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      />
    </svg>
  );
}

function DropdownMenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = createSignal(true);
  const [urlsChecked, setUrlsChecked] = createSignal(false);
  const [person, setPerson] = createSignal("pedro");

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger class="IconButton" aria-label="Customise options">
        <HamburgerMenuIcon />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content class="DropdownMenuContent">
          <DropdownMenu.Item key="new-tab" class="DropdownMenuItem">
            New Tab <div class="RightSlot">⌘+T</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="new-window" class="DropdownMenuItem">
            New Window <div class="RightSlot">⌘+N</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="new-private-window" class="DropdownMenuItem" isDisabled>
            New Private Window <div class="RightSlot">⇧+⌘+N</div>
          </DropdownMenu.Item>
          <DropdownMenu.Sub gutter={2} shift={-5}>
            <DropdownMenu.SubTrigger key="more-tools" class="DropdownMenuSubTrigger">
              More Tools
              <div class="RightSlot">
                <ChevronRightIcon />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent id="foo" class="DropdownMenuSubContent">
                <DropdownMenu.Item key="save-page-as" class="DropdownMenuItem">
                  Save Page As… <div class="RightSlot">⌘+S</div>
                </DropdownMenu.Item>
                <DropdownMenu.Item key="create-shortcut" class="DropdownMenuItem">
                  Create Shortcut…
                </DropdownMenu.Item>
                <DropdownMenu.Item key="name-window" class="DropdownMenuItem">
                  Name Window…
                </DropdownMenu.Item>
                <DropdownMenu.Separator class="DropdownMenu.Separator" />
                <DropdownMenu.Item key="developer-tools" class="DropdownMenuItem">
                  Developer Tools
                </DropdownMenu.Item>
                <DropdownMenu.Sub gutter={2} shift={-5}>
                  <DropdownMenu.SubTrigger key="more-tools-2" class="DropdownMenuSubTrigger">
                    More Tools
                    <div class="RightSlot">
                      <ChevronRightIcon />
                    </div>
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.SubContent id="bar" class="DropdownMenuSubContent">
                      <DropdownMenu.Item key="save-page-as-2" class="DropdownMenuItem">
                        Save Page As… <div class="RightSlot">⌘+S</div>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item key="create-shortcut-2" class="DropdownMenuItem">
                        Create Shortcut…
                      </DropdownMenu.Item>
                      <DropdownMenu.Item key="name-window-2" class="DropdownMenuItem">
                        Name Window…
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator class="DropdownMenu.Separator" />
                      <DropdownMenu.Item key="developer-tools-2" class="DropdownMenuItem">
                        Developer Tools
                      </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Portal>
                </DropdownMenu.Sub>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator class="DropdownMenuSeparator" />

          <DropdownMenu.CheckboxItem
            key="show-bookmarks"
            class="DropdownMenuCheckboxItem"
            isChecked={bookmarksChecked()}
            onCheckedChange={setBookmarksChecked}
          >
            <DropdownMenu.ItemIndicator class="DropdownMenuItemIndicator">
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Bookmarks <div class="RightSlot">⌘+B</div>
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            key="show-full-url"
            class="DropdownMenuCheckboxItem"
            isChecked={urlsChecked()}
            onCheckedChange={setUrlsChecked}
          >
            <DropdownMenu.ItemIndicator class="DropdownMenuItemIndicator">
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Show Full URLs
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator class="DropdownMenuSeparator" />

          <DropdownMenu.Group>
            <DropdownMenu.GroupLabel class="DropdownMenuLabel">People</DropdownMenu.GroupLabel>
            <DropdownMenu.RadioGroup value={person()} onValueChange={setPerson}>
              <DropdownMenu.RadioItem class="DropdownMenuRadioItem" value="pedro">
                <DropdownMenu.ItemIndicator class="DropdownMenuItemIndicator">
                  <DotFilledIcon />
                </DropdownMenu.ItemIndicator>
                Pedro Duarte
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem class="DropdownMenuRadioItem" value="colm">
                <DropdownMenu.ItemIndicator class="DropdownMenuItemIndicator">
                  <DotFilledIcon />
                </DropdownMenu.ItemIndicator>
                Colm Tuite
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Group>

          <DropdownMenu.Arrow class="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}

function ContextMenuDemo() {
  const [bookmarksChecked, setBookmarksChecked] = createSignal(true);
  const [urlsChecked, setUrlsChecked] = createSignal(false);
  const [person, setPerson] = createSignal("pedro");

  return (
    <ContextMenu>
      <ContextMenu.Trigger class="ContextMenuTrigger" aria-label="Customise options">
        Right click here.
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content class="DropdownMenuContent">
          <ContextMenu.Item key="new-tab" class="DropdownMenuItem">
            New Tab <div class="RightSlot">⌘+T</div>
          </ContextMenu.Item>
          <ContextMenu.Item key="new-window" class="DropdownMenuItem">
            New Window <div class="RightSlot">⌘+N</div>
          </ContextMenu.Item>
          <ContextMenu.Item key="new-private-window" class="DropdownMenuItem" isDisabled>
            New Private Window <div class="RightSlot">⇧+⌘+N</div>
          </ContextMenu.Item>
          <ContextMenu.Sub gutter={2} shift={-5}>
            <ContextMenu.SubTrigger key="more-tools" class="DropdownMenuSubTrigger">
              More Tools
              <div class="RightSlot">
                <ChevronRightIcon />
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent class="DropdownMenuSubContent">
                <ContextMenu.Item key="save-page-as" class="DropdownMenuItem">
                  Save Page As… <div class="RightSlot">⌘+S</div>
                </ContextMenu.Item>
                <ContextMenu.Item key="create-shortcut" class="DropdownMenuItem">
                  Create Shortcut…
                </ContextMenu.Item>
                <ContextMenu.Item key="name-window" class="DropdownMenuItem">
                  Name Window…
                </ContextMenu.Item>
                <ContextMenu.Separator class="DropdownMenu.Separator" />
                <ContextMenu.Item key="developer-tools" class="DropdownMenuItem">
                  Developer Tools
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Separator class="DropdownMenuSeparator" />

          <ContextMenu.CheckboxItem
            key="show-bookmarks"
            class="DropdownMenuCheckboxItem"
            isChecked={bookmarksChecked()}
            onCheckedChange={setBookmarksChecked}
          >
            <ContextMenu.ItemIndicator class="DropdownMenuItemIndicator">
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show Bookmarks <div class="RightSlot">⌘+B</div>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            key="show-full-url"
            class="DropdownMenuCheckboxItem"
            isChecked={urlsChecked()}
            onCheckedChange={setUrlsChecked}
          >
            <ContextMenu.ItemIndicator class="DropdownMenuItemIndicator">
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show Full URLs
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator class="DropdownMenuSeparator" />

          <ContextMenu.Group>
            <ContextMenu.GroupLabel class="DropdownMenuLabel">People</ContextMenu.GroupLabel>
            <ContextMenu.RadioGroup value={person()} onValueChange={setPerson}>
              <ContextMenu.RadioItem class="DropdownMenuRadioItem" value="pedro">
                <ContextMenu.ItemIndicator class="DropdownMenuItemIndicator">
                  <DotFilledIcon />
                </ContextMenu.ItemIndicator>
                Pedro Duarte
              </ContextMenu.RadioItem>
              <ContextMenu.RadioItem class="DropdownMenuRadioItem" value="colm">
                <ContextMenu.ItemIndicator class="DropdownMenuItemIndicator">
                  <DotFilledIcon />
                </ContextMenu.ItemIndicator>
                Colm Tuite
              </ContextMenu.RadioItem>
            </ContextMenu.RadioGroup>
          </ContextMenu.Group>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu>
  );
}

const SelectItem = (props: ComponentProps<typeof Select.Item>) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Select.Item class={["SelectItem", local.class].filter(Boolean).join(" ")} {...others}>
      <Select.ItemLabel>{local.children}</Select.ItemLabel>
      <Select.ItemIndicator class="SelectItemIndicator">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

const SelectDemo = () => (
  <Select name="fruit" disallowEmptySelection={false}>
    <Select.Trigger class="SelectTrigger" aria-label="Food">
      <Select.Value placeholder="Select a fruit…" />
      <Select.Icon class="SelectIcon" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content class="SelectContent">
        <Select.Arrow class="DropdownMenuArrow" />
        <Select.Listbox>
          <Select.Group>
            <Select.GroupLabel class="SelectLabel">Fruits</Select.GroupLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </Select.Group>

          <Select.Separator class="SelectSeparator" />

          <Select.Group>
            <Select.GroupLabel class="SelectLabel">Vegetables</Select.GroupLabel>
            <SelectItem value="aubergine">Aubergine</SelectItem>
            <SelectItem value="broccoli">Broccoli</SelectItem>
            <SelectItem value="carrot" isDisabled>
              Carrot
            </SelectItem>
            <SelectItem value="courgette">Courgette</SelectItem>
            <SelectItem value="leek">leek</SelectItem>
          </Select.Group>

          <Select.Separator class="SelectSeparator" />

          <Select.Group>
            <Select.GroupLabel class="SelectLabel">Meat</Select.GroupLabel>
            <SelectItem value="beef">Beef</SelectItem>
            <SelectItem value="chicken">Chicken</SelectItem>
            <SelectItem value="lamb">Lamb</SelectItem>
            <SelectItem value="pork">Pork</SelectItem>
          </Select.Group>
        </Select.Listbox>
      </Select.Content>
    </Select.Portal>
  </Select>
);

export default function App() {
  let formRef: HTMLFormElement | undefined;

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(formRef);

    alert(JSON.stringify(Object.fromEntries(formData), null, 2));
  };

  return (
    <I18nProvider locale="ar-AR">
      <DropdownMenuDemo />
    </I18nProvider>
  );
}
