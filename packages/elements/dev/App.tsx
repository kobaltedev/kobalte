import { createSignal } from "solid-js";

import { ContextMenu, I18nProvider, Menu } from "../src";

function DotFilledIcon(props: any) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function TestMenu() {
  const [bookmarksChecked, setBookmarksChecked] = createSignal(true);
  const [urlsChecked, setUrlsChecked] = createSignal(false);
  const [person, setPerson] = createSignal("pedro");

  const handleAction = (key: string) => {
    console.log(key);
  };

  return (
    <Menu onAction={handleAction}>
      <Menu.Trigger class="button">
        <span>Actions</span>
        <Menu.Icon class="ml-2" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Panel class="menu">
            <Menu.Arrow />
            <Menu.Item key="edit" class="menu-item">
              Edit
            </Menu.Item>
            <Menu.Item key="share" class="menu-item">
              Share
            </Menu.Item>
            <Menu.Item key="delete" isDisabled class="menu-item">
              Delete
            </Menu.Item>
            <Menu.Sub gutter={16} shift={-9}>
              <Menu.SubTrigger key="find" class="menu-item">
                <span>Find</span>
                <span aria-hidden="true" class="ml-auto">
                  »
                </span>
              </Menu.SubTrigger>
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Panel class="menu">
                    <Menu.Item key="find-web" class="menu-item">
                      Search the Web...
                    </Menu.Item>
                    <Menu.Item key="find-only" class="menu-item">
                      Find...
                    </Menu.Item>
                    <Menu.Sub gutter={16} shift={-9}>
                      <Menu.SubTrigger key="sub3" class="menu-item">
                        <span>Nested</span>
                        <span aria-hidden="true" class="ml-auto">
                          »
                        </span>
                      </Menu.SubTrigger>
                      <Menu.Portal>
                        <Menu.Positioner>
                          <Menu.Panel class="menu">
                            <Menu.Item key="copy" class="menu-item">
                              Copy
                            </Menu.Item>
                            <Menu.Item key="paste" class="menu-item">
                              Paste
                            </Menu.Item>
                          </Menu.Panel>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.Sub>
                    <Menu.Item key="find-next" class="menu-item">
                      Find Next...
                    </Menu.Item>
                    <Menu.Item key="find-previous" class="menu-item">
                      Find Previous...
                    </Menu.Item>
                  </Menu.Panel>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Sub>
            <Menu.ItemCheckbox
              key="bookmarks"
              isChecked={bookmarksChecked()}
              onCheckedChange={setBookmarksChecked}
              class="menu-item"
            >
              <Menu.ItemIndicator forceMount class="opacity-0 data-[checked]:opacity-100">
                ✓
              </Menu.ItemIndicator>
              <Menu.ItemLabel>Show Bookmarks</Menu.ItemLabel>
            </Menu.ItemCheckbox>
            <Menu.ItemCheckbox
              key="urls"
              isChecked={urlsChecked()}
              onCheckedChange={setUrlsChecked}
              class="menu-item"
            >
              <Menu.ItemIndicator forceMount class="opacity-0 data-[checked]:opacity-100">
                ✓
              </Menu.ItemIndicator>
              <Menu.ItemLabel>Show Full URLs</Menu.ItemLabel>
            </Menu.ItemCheckbox>
            <Menu.RadioGroup value={person()} onValueChange={setPerson}>
              <Menu.GroupLabel class="menu-group-label">People</Menu.GroupLabel>
              <Menu.ItemRadio value="pedro" class="menu-item">
                <Menu.ItemIndicator forceMount class="opacity-0 data-[checked]:opacity-100">
                  <DotFilledIcon />
                </Menu.ItemIndicator>
                <Menu.ItemLabel>Pedro Duarte</Menu.ItemLabel>
              </Menu.ItemRadio>
              <Menu.ItemRadio value="colm" class="menu-item">
                <Menu.ItemIndicator forceMount class="opacity-0 data-[checked]:opacity-100">
                  <DotFilledIcon />
                </Menu.ItemIndicator>
                <Menu.ItemLabel>Colm Tuite</Menu.ItemLabel>
              </Menu.ItemRadio>
            </Menu.RadioGroup>
          </Menu.Panel>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu>
  );
}

function TestContextMenu() {
  const [bookmarksChecked, setBookmarksChecked] = createSignal(true);
  const [urlsChecked, setUrlsChecked] = createSignal(false);
  const [person, setPerson] = createSignal("pedro");

  const handleAction = (key: string) => {
    console.log(key);
  };

  return (
    <ContextMenu onAction={handleAction}>
      <ContextMenu.Trigger class="context-menu-trigger">Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Panel class="menu">
            <ContextMenu.Item key="edit" class="menu-item">
              Edit
            </ContextMenu.Item>
            <ContextMenu.Item key="share" class="menu-item">
              Share
            </ContextMenu.Item>
            <ContextMenu.Item key="delete" isDisabled class="menu-item">
              Delete
            </ContextMenu.Item>
            <ContextMenu.Sub gutter={16} shift={-9}>
              <ContextMenu.SubTrigger key="find" class="menu-item">
                <span>Find</span>
                <span aria-hidden="true" class="ml-auto">
                  »
                </span>
              </ContextMenu.SubTrigger>
              <ContextMenu.Portal>
                <ContextMenu.Positioner>
                  <ContextMenu.Panel class="menu">
                    <ContextMenu.Item key="find-web" class="menu-item">
                      Search the Web...
                    </ContextMenu.Item>
                    <ContextMenu.Item key="find-only" class="menu-item">
                      Find...
                    </ContextMenu.Item>
                    <ContextMenu.Sub gutter={16} shift={-9}>
                      <ContextMenu.SubTrigger key="sub3" class="menu-item">
                        <span>Nested</span>
                        <span aria-hidden="true" class="ml-auto">
                          »
                        </span>
                      </ContextMenu.SubTrigger>
                      <ContextMenu.Portal>
                        <ContextMenu.Positioner>
                          <ContextMenu.Panel class="menu">
                            <ContextMenu.Item key="copy" class="menu-item">
                              Copy
                            </ContextMenu.Item>
                            <ContextMenu.Item key="paste" class="menu-item">
                              Paste
                            </ContextMenu.Item>
                          </ContextMenu.Panel>
                        </ContextMenu.Positioner>
                      </ContextMenu.Portal>
                    </ContextMenu.Sub>
                    <ContextMenu.Item key="find-next" class="menu-item">
                      Find Next...
                    </ContextMenu.Item>
                    <ContextMenu.Item key="find-previous" class="menu-item">
                      Find Previous...
                    </ContextMenu.Item>
                  </ContextMenu.Panel>
                </ContextMenu.Positioner>
              </ContextMenu.Portal>
            </ContextMenu.Sub>
            <ContextMenu.Separator />
            <ContextMenu.ItemCheckbox
              key="bookmarks"
              isChecked={bookmarksChecked()}
              onCheckedChange={setBookmarksChecked}
              class="menu-item"
            >
              <ContextMenu.ItemIndicator forceMount class="opacity-0 data-[checked]:opacity-100">
                ✓
              </ContextMenu.ItemIndicator>
              <ContextMenu.ItemLabel>Show Bookmarks</ContextMenu.ItemLabel>
            </ContextMenu.ItemCheckbox>
            <ContextMenu.ItemCheckbox
              key="urls"
              isChecked={urlsChecked()}
              onCheckedChange={setUrlsChecked}
              class="menu-item"
            >
              <ContextMenu.ItemIndicator forceMount class="opacity-0 data-[checked]:opacity-100">
                ✓
              </ContextMenu.ItemIndicator>
              <ContextMenu.ItemLabel>Show Full URLs</ContextMenu.ItemLabel>
            </ContextMenu.ItemCheckbox>
            <ContextMenu.Separator />
            <ContextMenu.RadioGroup value={person()} onValueChange={setPerson}>
              <ContextMenu.GroupLabel class="menu-group-label">People</ContextMenu.GroupLabel>
              <ContextMenu.ItemRadio value="pedro" class="menu-item">
                <ContextMenu.ItemIndicator forceMount class="opacity-0 data-[checked]:opacity-100">
                  <DotFilledIcon />
                </ContextMenu.ItemIndicator>
                <ContextMenu.ItemLabel>Pedro Duarte</ContextMenu.ItemLabel>
              </ContextMenu.ItemRadio>
              <ContextMenu.ItemRadio value="colm" class="menu-item">
                <ContextMenu.ItemIndicator forceMount class="opacity-0 data-[checked]:opacity-100">
                  <DotFilledIcon />
                </ContextMenu.ItemIndicator>
                <ContextMenu.ItemLabel>Colm Tuite</ContextMenu.ItemLabel>
              </ContextMenu.ItemRadio>
            </ContextMenu.RadioGroup>
          </ContextMenu.Panel>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <TestMenu />
      <TestContextMenu />
    </I18nProvider>
  );
}
