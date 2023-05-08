import { Tabs } from "@kobalte/core";
import { createSignal, For } from "solid-js";

import style from "./tabs.module.css";

export function BasicExample() {
  return (
    <Tabs.Root aria-label="Main navigation" class={style["tabs"]}>
      <Tabs.List class={style["tabs__list"]}>
        <Tabs.Trigger class={style["tabs__trigger"]} value="profile">
          Profile
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="dashboard">
          Dashboard
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="settings">
          Settings
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="contact">
          Contact
        </Tabs.Trigger>
        <Tabs.Indicator class={style["tabs__indicator"]} />
      </Tabs.List>
      <Tabs.Content class={style["tabs__content"]} value="profile">
        Profile details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="dashboard">
        Dashboard details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="settings">
        Settings details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="contact">
        Contact details
      </Tabs.Content>
    </Tabs.Root>
  );
}

export function DefaultValueExample() {
  return (
    <Tabs.Root aria-label="Main navigation" defaultValue="dashboard" class={style["tabs"]}>
      <Tabs.List class={style["tabs__list"]}>
        <Tabs.Trigger class={style["tabs__trigger"]} value="profile">
          Profile
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="dashboard">
          Dashboard
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="settings">
          Settings
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="contact">
          Contact
        </Tabs.Trigger>
        <Tabs.Indicator class={style["tabs__indicator"]} />
      </Tabs.List>
      <Tabs.Content class={style["tabs__content"]} value="profile">
        Profile details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="dashboard">
        Dashboard details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="settings">
        Settings details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="contact">
        Contact details
      </Tabs.Content>
    </Tabs.Root>
  );
}

export function ControlledExample() {
  const [selectedTab, setSelectedTab] = createSignal("settings");

  return (
    <>
      <Tabs.Root
        value={selectedTab()}
        onChange={setSelectedTab}
        aria-label="Main navigation"
        class={style["tabs"]}
      >
        <Tabs.List class={style["tabs__list"]}>
          <Tabs.Trigger class={style["tabs__trigger"]} value="profile">
            Profile
          </Tabs.Trigger>
          <Tabs.Trigger class={style["tabs__trigger"]} value="dashboard">
            Dashboard
          </Tabs.Trigger>
          <Tabs.Trigger class={style["tabs__trigger"]} value="settings">
            Settings
          </Tabs.Trigger>
          <Tabs.Trigger class={style["tabs__trigger"]} value="contact">
            Contact
          </Tabs.Trigger>
          <Tabs.Indicator class={style["tabs__indicator"]} />
        </Tabs.List>
        <Tabs.Content class={style["tabs__content"]} value="profile">
          Profile details
        </Tabs.Content>
        <Tabs.Content class={style["tabs__content"]} value="dashboard">
          Dashboard details
        </Tabs.Content>
        <Tabs.Content class={style["tabs__content"]} value="settings">
          Settings details
        </Tabs.Content>
        <Tabs.Content class={style["tabs__content"]} value="contact">
          Contact details
        </Tabs.Content>
      </Tabs.Root>
      <p class="not-prose text-sm mt-2">Selected tab: {selectedTab()}</p>
    </>
  );
}

export function FocusableContentExample() {
  return (
    <Tabs.Root aria-label="Main navigation" class={style["tabs"]}>
      <Tabs.List class={style["tabs__list"]}>
        <Tabs.Trigger class={style["tabs__trigger"]} value="profile">
          Profile
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="dashboard">
          Dashboard
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="settings">
          Settings
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="contact">
          Contact
        </Tabs.Trigger>
        <Tabs.Indicator class={style["tabs__indicator"]} />
      </Tabs.List>
      <Tabs.Content class={style["tabs__content"]} value="profile">
        <input
          class="border border-zinc-300 text-zinc-900 w-40 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Change password"
        />
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="dashboard">
        Dashboard details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="settings">
        Settings details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="contact">
        Contact details
      </Tabs.Content>
    </Tabs.Root>
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
      <Tabs.Root>
        <Tabs.List class={style["tabs__list"]}>
          <For each={tabs()}>
            {tab => (
              <Tabs.Trigger class={style["tabs__trigger"]} value={tab.id}>
                {tab.title}
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator class={style["tabs__indicator"]} />
        </Tabs.List>
        <For each={tabs()}>
          {tab => (
            <Tabs.Content class={style["tabs__content"]} value={tab.id}>
              {tab.content}
            </Tabs.Content>
          )}
        </For>
      </Tabs.Root>
    </>
  );
}

export function ManualActivationExample() {
  return (
    <Tabs.Root aria-label="Main navigation" activationMode="manual" class={style["tabs"]}>
      <Tabs.List class={style["tabs__list"]}>
        <Tabs.Trigger class={style["tabs__trigger"]} value="profile">
          Profile
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="dashboard">
          Dashboard
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="settings">
          Settings
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="contact">
          Contact
        </Tabs.Trigger>
        <Tabs.Indicator class={style["tabs__indicator"]} />
      </Tabs.List>
      <Tabs.Content class={style["tabs__content"]} value="profile">
        Profile details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="dashboard">
        Dashboard details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="settings">
        Settings details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="contact">
        Contact details
      </Tabs.Content>
    </Tabs.Root>
  );
}

export function VerticalOrientationExample() {
  return (
    <Tabs.Root aria-label="Main navigation" orientation="vertical" class={style["tabs"]}>
      <Tabs.List class={style["tabs__list"]}>
        <Tabs.Trigger class={style["tabs__trigger"]} value="profile">
          Profile
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="dashboard">
          Dashboard
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="settings">
          Settings
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="contact">
          Contact
        </Tabs.Trigger>
        <Tabs.Indicator class={style["tabs__indicator"]} />
      </Tabs.List>
      <Tabs.Content class={style["tabs__content"]} value="profile">
        Profile details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="dashboard">
        Dashboard details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="settings">
        Settings details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="contact">
        Contact details
      </Tabs.Content>
    </Tabs.Root>
  );
}

export function DisabledTabsExample() {
  return (
    <Tabs.Root aria-label="Main navigation" disabled class={style["tabs"]}>
      <Tabs.List class={style["tabs__list"]}>
        <Tabs.Trigger class={style["tabs__trigger"]} value="profile">
          Profile
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="dashboard">
          Dashboard
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="settings">
          Settings
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="contact">
          Contact
        </Tabs.Trigger>
        <Tabs.Indicator class={style["tabs__indicator"]} />
      </Tabs.List>
      <Tabs.Content class={style["tabs__content"]} value="profile">
        Profile details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="dashboard">
        Dashboard details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="settings">
        Settings details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="contact">
        Contact details
      </Tabs.Content>
    </Tabs.Root>
  );
}

export function SingleDisabledTabExample() {
  return (
    <Tabs.Root aria-label="Main navigation" class={style["tabs"]}>
      <Tabs.List class={style["tabs__list"]}>
        <Tabs.Trigger class={style["tabs__trigger"]} value="profile">
          Profile
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="dashboard">
          Dashboard
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="settings" disabled>
          Settings
        </Tabs.Trigger>
        <Tabs.Trigger class={style["tabs__trigger"]} value="contact">
          Contact
        </Tabs.Trigger>
        <Tabs.Indicator class={style["tabs__indicator"]} />
      </Tabs.List>
      <Tabs.Content class={style["tabs__content"]} value="profile">
        Profile details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="dashboard">
        Dashboard details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="settings">
        Settings details
      </Tabs.Content>
      <Tabs.Content class={style["tabs__content"]} value="contact">
        Contact details
      </Tabs.Content>
    </Tabs.Root>
  );
}
