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
  ...CHANGELOG_NAV_SECTIONS,
];
