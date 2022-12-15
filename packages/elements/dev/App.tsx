import { I18nProvider, Tabs } from "../src";
import { TabsPanel } from "../src/tabs/tabs-panel";

function Demo() {
  return (
    <Tabs class="wrapper" defaultValue="vegetables">
      <Tabs.List class="tab-list" aria-label="Groceries">
        <Tabs.Trigger key="fruits">Fruits</Tabs.Trigger>
        <Tabs.Trigger key="vegetables">Vegetables</Tabs.Trigger>
        <Tabs.Trigger key="meats">Meats</Tabs.Trigger>
      </Tabs.List>
      <div class="panels">
        <TabsPanel key="fruits">
          <ul>
            <li>🍎 Apple</li>
            <li>🍇 Grape</li>
            <li>🍊 Orange</li>
          </ul>
        </TabsPanel>
        <TabsPanel key="vegetables">
          <ul>
            <li>🥕 Carrot</li>
            <li>🧅 Onion</li>
            <li>🥔 Potato</li>
          </ul>
        </TabsPanel>
        <TabsPanel key="meats">
          <ul>
            <li>🥩 Beef</li>
            <li>🍗 Chicken</li>
            <li>🥓 Pork</li>
          </ul>
        </TabsPanel>
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
