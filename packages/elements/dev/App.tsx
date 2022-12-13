import { I18nProvider, Menu } from "../src";

function TestMenu() {
  const handleAction = (key: string) => {
    console.log(key);
  };

  return (
    <Menu onAction={handleAction}>
      <Menu.Trigger class="button">Actions</Menu.Trigger>
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
            <Menu.Sub key="find" gutter={8} shift={-9}>
              <Menu.SubTrigger class="menu-item">
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
