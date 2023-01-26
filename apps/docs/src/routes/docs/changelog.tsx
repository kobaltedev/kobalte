import { Outlet } from "@solidjs/router";

import { Layout } from "../../components";
import { NavSection } from "../../model/navigation";
import { CORE_VERSIONS } from "../../VERSIONS";

const CHANGELOG_NAV_SECTIONS: NavSection[] = [
  {
    title: "Changelog",
    links: CORE_VERSIONS.map(version => ({
      title: `v${version}`,
      href: `/docs/changelog/${version.replaceAll(".", "-")}`,
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
