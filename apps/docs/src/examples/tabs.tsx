import { Tabs as TabsBase } from "@kobalte/core";
import { ComponentProps, createSignal, splitProps } from "solid-js";

function Tabs(props: ComponentProps<typeof TabsBase>) {
  return <TabsBase class="w-full" {...props} />;
}

function TabList(props: ComponentProps<typeof TabsBase.List>) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <TabsBase.List
      class="relative flex items-center border-b border-zinc-300 dark:border-zinc-700"
      {...others}
    >
      {local.children}
      <TabsBase.Indicator class="absolute bottom-[-1px] h-0.5 bg-blue-600 transition-all" />
    </TabsBase.List>
  );
}

function Tab(props: ComponentProps<typeof TabsBase.Trigger>) {
  return (
    <TabsBase.Trigger
      class="inline-block px-4 py-2 outline-none ui-focus:bg-zinc-100 ui-hover:text-zinc-600 ui-hover:bg-zinc-50 dark:ui-hover:bg-zinc-800 dark:ui-hover:text-zinc-300 dark:ui-focus:bg-zinc-800 ui-disabled:opacity-40 ui-disabled:ui-hover:bg-transparent"
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
