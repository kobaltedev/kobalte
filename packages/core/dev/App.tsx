import { I18nProvider, Tabs } from "../src";

export default function App() {
  return (
    <I18nProvider>
      <Tabs.Root aria-label="Main navigation" class="tabs">
        <Tabs.List class="tabs__list">
          <Tabs.Trigger class="tabs__trigger" value="profile">
            Profile
          </Tabs.Trigger>
          <Tabs.Trigger class="tabs__trigger" value="dashboard">
            Dashboard
          </Tabs.Trigger>
          <Tabs.Trigger class="tabs__trigger" value="settings">
            Settings
          </Tabs.Trigger>
          <Tabs.Trigger class="tabs__trigger" value="contact">
            Contact
          </Tabs.Trigger>
          <Tabs.Indicator class="tabs__indicator" />
        </Tabs.List>
        <Tabs.Content class="tabs__content" value="profile">
          Profile details
        </Tabs.Content>
        <Tabs.Content class="tabs__content" value="dashboard">
          Dashboard details
        </Tabs.Content>
        <Tabs.Content class="tabs__content" value="settings">
          Settings details
        </Tabs.Content>
        <Tabs.Content class="tabs__content" value="contact">
          Contact details
        </Tabs.Content>
      </Tabs.Root>
    </I18nProvider>
  );
}
