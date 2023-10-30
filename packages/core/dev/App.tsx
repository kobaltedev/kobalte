import * as Menu from "../src/menu";
import * as Menubar from "../src/menubar";

export default function App() {
  return <>

    <Menubar.Root focusOnAlt>

      <Menubar.Menu value="test-1-menu">
        <Menu.MenuTrigger>Test 1</Menu.MenuTrigger>

        <Menu.MenuPortal>
          <Menu.MenuContent>

            <Menu.MenuItem>
              Item 1
            </Menu.MenuItem>

            <Menu.MenuItem>
              Item 2
            </Menu.MenuItem>

            <Menu.MenuSub>
              <Menu.MenuSubTrigger>
                {">"}
              </Menu.MenuSubTrigger>
              <Menu.MenuPortal>
                <Menu.MenuSubContent>
                  <Menu.MenuItem>
                    Item 1
                  </Menu.MenuItem>

                  <Menu.MenuItem>
                    Item 2
                  </Menu.MenuItem>
                </Menu.MenuSubContent>
              </Menu.MenuPortal>
            </Menu.MenuSub>

          </Menu.MenuContent>
        </Menu.MenuPortal>
      </Menubar.Menu>


      <Menubar.Menu value="test-2-menu">
        <Menu.MenuTrigger>Test 2</Menu.MenuTrigger>

        <Menu.MenuPortal>
          <Menu.MenuContent>

            <Menu.MenuItem>
              Item 1
            </Menu.MenuItem>

            <Menu.MenuItem>
              Item 2
            </Menu.MenuItem>

            <Menu.MenuSub>
              <Menu.MenuSubTrigger>
                {">"}
              </Menu.MenuSubTrigger>
              <Menu.MenuPortal>
                <Menu.MenuSubContent>
                  <Menu.MenuItem>
                    Item 1
                  </Menu.MenuItem>

                  <Menu.MenuItem>
                    Item 2
                  </Menu.MenuItem>
                </Menu.MenuSubContent>
              </Menu.MenuPortal>
            </Menu.MenuSub>

          </Menu.MenuContent>
        </Menu.MenuPortal>
      </Menubar.Menu>


      <Menubar.Menu value="test-3-menu">
        <Menu.MenuTrigger>Test 3</Menu.MenuTrigger>

        <Menu.MenuPortal>
          <Menu.MenuContent>

            <Menu.MenuItem>
              Item 1
            </Menu.MenuItem>

            <Menu.MenuItem>
              Item 2
            </Menu.MenuItem>

            <Menu.MenuSub>
              <Menu.MenuSubTrigger>
                {">"}
              </Menu.MenuSubTrigger>
              <Menu.MenuPortal>
                <Menu.MenuSubContent>
                  <Menu.MenuItem>
                    Item 1
                  </Menu.MenuItem>

                  <Menu.MenuItem>
                    Item 2
                  </Menu.MenuItem>
                </Menu.MenuSubContent>
              </Menu.MenuPortal>
            </Menu.MenuSub>

          </Menu.MenuContent>
        </Menu.MenuPortal>
      </Menubar.Menu>


    </Menubar.Root>

  </>;
}
