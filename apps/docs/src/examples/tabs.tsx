import { Tabs as TabsBase } from "@kobalte/core";
import { ComponentProps, createSignal, For, splitProps } from "solid-js";

function Tabs(props: ComponentProps<typeof TabsBase>) {
  return <TabsBase class="w-full data-[orientation='vertical']:flex" {...props} />;
}

function TabList(props: ComponentProps<typeof TabsBase.List>) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <TabsBase.List
      class="relative flex items-center data-[orientation='horizontal']:border-b data-[orientation='vertical']:flex-col data-[orientation='vertical']:items-stretch data-[orientation='vertical']:border-r border-zinc-300 dark:border-zinc-700"
      {...others}
    >
      {local.children}
      <TabsBase.Indicator class="absolute data-[orientation='horizontal']:bottom-[-1px] data-[orientation='vertical']:right-[-1px] data-[orientation='horizontal']:h-0.5 data-[orientation='vertical']:w-0.5 bg-blue-600 transition-all" />
    </TabsBase.List>
  );
}

function Tab(props: ComponentProps<typeof TabsBase.Trigger>) {
  return (
    <TabsBase.Trigger
      class="inline-block px-4 py-2 outline-none ui-focus-visible:bg-zinc-100 ui-hover:text-zinc-600 ui-hover:bg-zinc-50 dark:ui-hover:bg-zinc-800 dark:ui-hover:text-zinc-300 dark:ui-focus-visible:bg-zinc-800 ui-disabled:opacity-40 ui-disabled:ui-hover:bg-transparent"
      {...props}
    />
  );
}

function TabPanel(props: ComponentProps<typeof TabsBase.Content>) {
  return <TabsBase.Content class="p-4" {...props} />;
}

export function BasicExample(props: ComponentProps<typeof TabsBase>) {
  return (
    <Tabs {...props}>
      <TabList>
        <Tab value="profile">Profile</Tab>
        <Tab value="dashboard">Dashboard</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="contact">Contact</Tab>
      </TabList>
      <TabPanel value="profile">Profile details</TabPanel>
      <TabPanel value="dashboard">Dashboard details</TabPanel>
      <TabPanel value="settings">Settings details</TabPanel>
      <TabPanel value="contact">Contact details</TabPanel>
    </Tabs>
  );
}

export function ControlledExample() {
  const [selectedTab, setSelectedTab] = createSignal("settings");

  return (
    <>
      <Tabs value={selectedTab()} onValueChange={setSelectedTab}>
        <TabList>
          <Tab value="profile">Profile</Tab>
          <Tab value="dashboard">Dashboard</Tab>
          <Tab value="settings">Settings</Tab>
          <Tab value="contact">Contact</Tab>
        </TabList>
        <TabPanel value="profile">Profile details</TabPanel>
        <TabPanel value="dashboard">Dashboard details</TabPanel>
        <TabPanel value="settings">Settings details</TabPanel>
        <TabPanel value="contact">Contact details</TabPanel>
      </Tabs>
      <p class="not-prose text-sm mt-2">Selected tab: {selectedTab()}</p>
    </>
  );
}

export function FocusableContentExample() {
  return (
    <Tabs>
      <TabList>
        <Tab value="profile">Profile</Tab>
        <Tab value="dashboard">Dashboard</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="contact">Contact</Tab>
      </TabList>
      <TabPanel value="profile">
        <input
          class="border border-zinc-300 text-zinc-900 w-40 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Change password"
        />
      </TabPanel>
      <TabPanel value="dashboard">Dashboard details</TabPanel>
      <TabPanel value="settings">Settings details</TabPanel>
      <TabPanel value="contact">Contact details</TabPanel>
    </Tabs>
  );
}

export function DynamicContentExample() {
  const [tabs, setTabs] = createSignal([
    { id: "1", title: "Tab 1", content: "Tab body 1" },
    { id: "2", title: "Tab 2", content: "Tab body 2" },
    { id: "3", title: "Tab 3", content: "Tab body 3" },
  ]);

  const addTab = () => {
    setTabs(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        title: `Tab ${prev.length + 1}`,
        content: `Tab Body ${prev.length + 1}`,
      },
    ]);
  };

  const removeTab = () => {
    if (tabs().length > 1) {
      setTabs(prev => prev.slice(0, -1));
    }
  };

  return (
    <>
      <div class="flex items-center space-x-2 mb-2">
        <button
          class="appearance-none outline-none h-10 px-4 rounded-md text-white bg-blue-600 dark:text-white/90 disabled:opacity-40 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500/30"
          onClick={addTab}
        >
          Add tab
        </button>
        <button
          class="appearance-none outline-none h-10 px-4 rounded-md text-white bg-blue-600 dark:text-white/90 disabled:opacity-40 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500/30"
          onClick={removeTab}
        >
          Remove tab
        </button>
      </div>
      <Tabs>
        <TabList>
          <For each={tabs()}>{tab => <Tab value={tab.id}>{tab.title}</Tab>}</For>
        </TabList>
        <For each={tabs()}>{tab => <TabPanel value={tab.id}>{tab.content}</TabPanel>}</For>
      </Tabs>
    </>
  );
}

export function DisabledTabExample() {
  return (
    <Tabs>
      <TabList>
        <Tab value="profile">Profile</Tab>
        <Tab value="dashboard">Dashboard</Tab>
        <Tab value="settings" isDisabled>
          Settings
        </Tab>
        <Tab value="contact">Contact</Tab>
      </TabList>
      <TabPanel value="profile">Profile details</TabPanel>
      <TabPanel value="dashboard">Dashboard details</TabPanel>
      <TabPanel value="settings">Settings details</TabPanel>
      <TabPanel value="contact">Contact details</TabPanel>
    </Tabs>
  );
}
