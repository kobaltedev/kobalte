import { I18nProvider, Tabs } from "../src";

export default function App() {
  return (
    <I18nProvider>
      <Tabs>
        <Tabs.TabList
          class="relative flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 border-b border-gray-200"
          aria-label="Navigation"
        >
          <Tabs.Tab
            value="profile"
            class="inline-block p-4 rounded-t-lg data-[selected]:text-blue-600 outline-none focus:outline-none focus:bg-gray-100"
          >
            Profile
          </Tabs.Tab>
          <Tabs.Tab
            value="dashboard"
            class="inline-block p-4 rounded-t-lg data-[selected]:text-blue-600 outline-none focus:outline-none focus:bg-gray-100"
          >
            Dashboard
          </Tabs.Tab>
          <Tabs.Tab
            value="settings"
            class="inline-block p-4 rounded-t-lg data-[selected]:text-blue-600 outline-none focus:outline-none focus:bg-gray-100"
          >
            Settings
          </Tabs.Tab>
          <Tabs.Tab
            value="contact"
            class="inline-block p-4 rounded-t-lg data-[selected]:text-blue-600 outline-none focus:outline-none focus:bg-gray-100"
          >
            Contact
          </Tabs.Tab>
          <Tabs.Tab
            isDisabled
            value="disabled"
            class="inline-block p-4 rounded-t-lg data-[disabled]:text-gray-400 data-[disabled]:cursor-not-allowed outline-none focus:outline-none"
          >
            Disabled
          </Tabs.Tab>
          <Tabs.TabIndicator class="absolute z-10 bottom-0 h-0.5 bg-blue-600 transition-all" />
        </Tabs.TabList>
      </Tabs>
    </I18nProvider>
  );
}
