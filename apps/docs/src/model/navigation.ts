interface NavLink {
  title: string;
  href: string;
  status?: "new" | "updated";
}

export interface NavSection {
  title: string;
  links: NavLink[];
}
