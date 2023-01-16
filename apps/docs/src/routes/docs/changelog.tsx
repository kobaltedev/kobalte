import { Outlet } from "@solidjs/router";

import { Layout } from "../../components";
import { NavSection } from "../../model/navigation";
import { CORE_VERSIONS, PIGMENT_VERSIONS } from "../../VERSIONS";

const CHANGELOG_NAV_SECTIONS: NavSection[] = [
  {
    title: "@kobalte/core",
    links: CORE_VERSIONS.map(version => ({
      title: `v${version}`,
      href: `/docs/changelog/core/${version.replaceAll(".", "-")}`,
    })),
  },
  {
    title: "@kobalte/pigment",
    links: PIGMENT_VERSIONS.map(version => ({
      title: `v${version}`,
      href: `/docs/changelog/pigment/${version.replaceAll(".", "-")}`,
    })),
  },
];

export default function ChangelogLayout() {
  return (
    <Layout navSections={CHANGELOG_NAV_SECTIONS}>
      <Outlet />
    </Layout>
  );
}
