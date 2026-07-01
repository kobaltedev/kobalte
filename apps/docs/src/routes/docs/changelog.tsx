import type { RouteProps } from "@solidjs/router";

import { CORE_VERSIONS } from "../../VERSIONS";
import type { NavSection } from "../../model/navigation";

const CHANGELOG_NAV_SECTIONS: NavSection[] = [
	{
		title: "Changelog",
		links: CORE_VERSIONS.map((version) => ({
			title: `v${version}`,
			href: `/docs/changelog/${version.replaceAll(".", "-")}`,
		})),
	},
];

export default function ChangelogLayout(props: RouteProps<string>) {
	return <>{props.children}</>;
}
