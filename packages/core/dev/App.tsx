import { DropdownMenu, I18nProvider, HoverCard, Select } from "../src";

function MySelect(props: any) {
  return (
    <div class="wrapper">
      <Select>
        <Select.Label>Favorite fruit</Select.Label>
        <Select.Trigger class="select">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Content class="popover">
              <Select.Listbox>
                <Select.Item class="select-item" value="Apple">
                  Apple
                </Select.Item>
                <Select.Item class="select-item" value="Banana">
                  Banana
                </Select.Item>
                <Select.Item class="select-item" value="Grape" isDisabled>
                  Grape
                </Select.Item>
                <Select.Item class="select-item" value="Orange">
                  Orange
                </Select.Item>
              </Select.Listbox>
            </Select.Content>
          </Select.Positioner>
        </Select.Portal>
      </Select>
    </div>
  );
}

function MyMenu(props: any) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger class="button">Edit</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Positioner>
          <DropdownMenu.Content class="menu">
            <DropdownMenu.Item class="menu-item" key="undo">
              Undo
            </DropdownMenu.Item>
            <DropdownMenu.Item class="menu-item" key="redo">
              Redo
            </DropdownMenu.Item>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger class="menu-item" key="find-trigger">
                Find
              </DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Positioner>
                  <DropdownMenu.Content class="menu">
                    <DropdownMenu.Item class="menu-item" key="search-web">
                      Search the web...
                    </DropdownMenu.Item>
                    <DropdownMenu.Item class="menu-item" key="find">
                      Find...
                    </DropdownMenu.Item>
                    <DropdownMenu.Item class="menu-item" key="find-next">
                      Find next...
                    </DropdownMenu.Item>
                    <DropdownMenu.Item class="menu-item" key="find-previous">
                      Find previous...
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Positioner>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Positioner>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}

export default function App() {
  return <I18nProvider></I18nProvider>;
}
