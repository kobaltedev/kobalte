interface NavLink {
  title: string;
  href: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

const VERSIONS = ["0.1.0"].reverse();

const CHANGELOG_NAV_SECTIONS: NavSection[] = [
  {
    title: "Changelog",
    links: VERSIONS.map(version => ({
      title: `v${version}`,
      href: `/docs/changelog/${version.replaceAll(".", "-")}`,
    })),
  },
];

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    links: [
      {
        title: "Introduction",
        href: "/docs/overview/introduction",
      },
      {
        title: "Getting started",
        href: "/docs/overview/getting-started",
      },
      {
        title: "Styling",
        href: "/docs/overview/styling",
      },
      {
        title: "Server side rendering",
        href: "/docs/overview/ssr",
      },
    ],
  },
  {
    title: "Components",
    links: [
      {
        title: "Alert",
        href: "/docs/components/alert",
      },
      {
        title: "Button",
        href: "/docs/components/button",
      },
      {
        title: "Checkbox",
        href: "/docs/components/checkbox",
      },
      {
        title: "Context Menu",
        href: "/docs/components/context-menu",
      },
      {
        title: "Dialog",
        href: "/docs/components/dialog",
      },
      {
        title: "Dropdown Menu",
        href: "/docs/components/dropdown-menu",
      },
      {
        title: "Hover Card",
        href: "/docs/components/hover-card",
      },
      {
        title: "Link",
        href: "/docs/components/link",
      },
      {
        title: "Popover",
        href: "/docs/components/popover",
      },
      {
        title: "Radio Group",
        href: "/docs/components/radio-group",
      },
      {
        title: "Select",
        href: "/docs/components/select",
      },
      {
        title: "Separator",
        href: "/docs/components/separator",
      },
      {
        title: "Switch",
        href: "/docs/components/switch",
      },
      {
        title: "Tabs",
        href: "/docs/components/tabs",
      },
      {
        title: "Toggle Button",
        href: "/docs/components/toggle-button",
      },
      {
        title: "I18nProvider",
        href: "/docs/components/i18n-provider",
      },
    ],
  },
  ...CHANGELOG_NAV_SECTIONS,
];
