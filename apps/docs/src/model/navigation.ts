interface NavLink {
	title: string;
	href: string;
	status?: "new" | "updated" | "unreleased";
}

export interface NavSection {
	title: string;
	links: NavLink[];
}
