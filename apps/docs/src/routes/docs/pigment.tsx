import { Outlet } from "@solidjs/router";

import { Layout } from "../../components";
import { NavSection } from "../../model/navigation";

const PIGMENT_NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    links: [
      {
        title: "Introduction",
        href: "/docs/pigment/overview/introduction",
      },
    ],
  },
];

export default function PigmentLayout() {
  return (
    <Layout navSections={PIGMENT_NAV_SECTIONS}>
      <Outlet />
    </Layout>
  );
}
