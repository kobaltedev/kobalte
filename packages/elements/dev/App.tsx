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
            <Menu.Item key="report" class="menu-item">
              Report
            </Menu.Item>
            <Menu.Sub key="sub" gutter={8} shift={-9}>
              <Menu.SubTrigger class="menu-item">Sub</Menu.SubTrigger>
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Panel class="menu">
                    <Menu.Item key="foo" class="menu-item">
                      Foo
                    </Menu.Item>
                    <Menu.Item key="Bar" class="menu-item">
                      Bar
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
