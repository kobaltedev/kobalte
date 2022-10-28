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
    title: "Introduction",
    links: [
      {
        title: "Getting started",
        href: "/docs/introduction/getting-started",
      },
    ],
  },
  {
    title: "Styles",
    links: [
      {
        title: "createStyles",
        href: "/docs/styles/create-styles",
      },
      {
        title: "Styled components",
        href: "/docs/styles/styled-components",
      },
    ],
  },
  {
    title: "Theming",
    links: [
      {
        title: "Default theme",
        href: "/docs/theming/default-theme",
      },
      {
        title: "Customize theme",
        href: "/docs/theming/customize-theme",
      },
      {
        title: "CSS variables",
        href: "/docs/theming/css-variables",
      },
      {
        title: "Color mode",
        href: "/docs/theming/color-mode",
      },
    ],
  },
  {
    title: "Buttons",
    links: [
      {
        title: "Button",
        href: "/docs/components/button",
      },
      {
        title: "IconButton",
        href: "/docs/components/icon-button",
      },
      {
        title: "CloseButton",
        href: "/docs/components/close-button",
      },
    ],
  },
  /*
  {
    title: "Data entry",
    links: [
      {
        title: "",
        href: "/docs/components/",
      },
    ],
  },
  */
  {
    title: "Data display",
    links: [
      {
        title: "Divider",
        href: "/docs/components/divider",
      },
      {
        title: "Image",
        href: "/docs/components/image",
      },
      {
        title: "Kbd",
        href: "/docs/components/kbd",
      },
    ],
  },
  /*
  {
    title: "Feedback",
    links: [
      {
        title: "",
        href: "/docs/components/",
      },
    ],
  },
  */
  {
    title: "Navigation",
    links: [
      {
        title: "Anchor",
        href: "/docs/components/anchor",
      },
    ],
  },
  {
    title: "Overlays",
    links: [
      {
        title: "Drawer",
        href: "/docs/components/drawer",
      },
      {
        title: "Modal",
        href: "/docs/components/modal",
      },
      {
        title: "Popover",
        href: "/docs/components/popover",
      },
    ],
  },
  {
    title: "Primitives",
    links: [
      {
        title: "createTransition",
        href: "/docs/primitives/create-transition",
      },
    ],
  },
  ...CHANGELOG_NAV_SECTIONS,
];
