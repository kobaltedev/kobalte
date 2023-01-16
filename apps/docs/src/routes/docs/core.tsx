import { Outlet } from "@solidjs/router";

import { Layout } from "../../components";
import { NavSection } from "../../model/navigation";

const CORE_NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    links: [
      {
        title: "Introduction",
        href: "/docs/core/overview/introduction",
      },
      {
        title: "Getting started",
        href: "/docs/core/overview/getting-started",
      },
      {
        title: "Styling",
        href: "/docs/core/overview/styling",
      },
      {
        title: "Server side rendering",
        href: "/docs/core/overview/ssr",
      },
      {
        title: "Press interactions",
        href: "/docs/core/overview/press-interactions",
      },
    ],
  },
  {
    title: "Components",
    links: [
      {
        title: "Alert",
        href: "/docs/core/components/alert",
      },
      {
        title: "Button",
        href: "/docs/core/components/button",
      },
      {
        title: "Checkbox",
        href: "/docs/core/components/checkbox",
      },
      {
        title: "Context Menu",
        href: "/docs/core/components/context-menu",
      },
      {
        title: "Dialog",
        href: "/docs/core/components/dialog",
      },
      {
        title: "Dropdown Menu",
        href: "/docs/core/components/dropdown-menu",
      },
      {
        title: "Hover Card",
        href: "/docs/core/components/hover-card",
      },
      {
        title: "Link",
        href: "/docs/core/components/link",
      },
      {
        title: "Popover",
        href: "/docs/core/components/popover",
      },
      {
        title: "Radio Group",
        href: "/docs/core/components/radio-group",
      },
      {
        title: "Select",
        href: "/docs/core/components/select",
      },
      {
        title: "Separator",
        href: "/docs/core/components/separator",
      },
      {
        title: "Switch",
        href: "/docs/core/components/switch",
      },
      {
        title: "Tabs",
        href: "/docs/core/components/tabs",
      },
      {
        title: "Text Field",
        href: "/docs/core/components/text-field",
      },
      {
        title: "Toggle Button",
        href: "/docs/core/components/toggle-button",
      },
      {
        title: "I18nProvider",
        href: "/docs/core/components/i18n-provider",
      },
    ],
  },
];

export default function CoreLayout() {
  return (
    <Layout navSections={CORE_NAV_SECTIONS}>
      <Outlet />
    </Layout>
  );
}
