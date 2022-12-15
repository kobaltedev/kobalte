import { I18nProvider, Tabs } from "../src";

function Demo() {
  return (
    <Tabs class="wrapper">
      <Tabs.TabList class="tab-list" aria-label="Groceries">
        <Tabs.Tab value="fruits" class="tab" isDisabled>
          Fruits
        </Tabs.Tab>
        <Tabs.Tab value="vegetables" class="tab">
          Vegetables
        </Tabs.Tab>
        <Tabs.Tab value="meats" class="tab">
          Meats
        </Tabs.Tab>
      </Tabs.TabList>
      <div class="panels">
        <Tabs.TabPanel value="fruits">
          <ul>
            <li>🍎 Apple</li>
            <li>🍇 Grape</li>
            <li>🍊 Orange</li>
          </ul>
        </Tabs.TabPanel>
        <Tabs.TabPanel value="vegetables">
          <ul>
            <li>🥕 Carrot</li>
            <li>🧅 Onion</li>
            <li>🥔 Potato</li>
          </ul>
          <input type="text" />
        </Tabs.TabPanel>
        <Tabs.TabPanel value="meats">
          <ul>
            <li>🥩 Beef</li>
            <li>🍗 Chicken</li>
            <li>🥓 Pork</li>
          </ul>
        </Tabs.TabPanel>
      </div>
    </Tabs>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Demo />
    </I18nProvider>
  );
}
