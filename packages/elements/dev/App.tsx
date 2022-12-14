import { I18nProvider, Menu } from "../src";

function TestMenu() {
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
            <Menu.Group>
              <Menu.GroupLabel class="menu-group-label">People</Menu.GroupLabel>
              <Menu.Item key="pedro" class="menu-item">
                Pedro Duarte
              </Menu.Item>
              <Menu.Item key="colm" class="menu-item">
                Colm Tuite
              </Menu.Item>
            </Menu.Group>
          </Menu.Panel>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <TestMenu />
    </I18nProvider>
  );
}
