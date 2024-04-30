import { RouteProps } from "@solidjs/router";

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
				title: "Animation",
				href: "/docs/core/overview/animation",
			},
			{
				title: "Polymorphism",
				href: "/docs/core/overview/polymorphism",
				status: "updated",
			},
			{
				title: "Server side rendering",
				href: "/docs/core/overview/ssr",
			},
		],
	},
	{
		title: "Components",
		links: [
			{
				title: "Accordion",
				href: "/docs/core/components/accordion",
				status: "updated",
			},
			{
				title: "Alert",
				href: "/docs/core/components/alert",
				status: "updated",
			},
			{
				title: "Alert Dialog",
				href: "/docs/core/components/alert-dialog",
				status: "updated",
			},
			{
				title: "Breadcrumbs",
				href: "/docs/core/components/breadcrumbs",
				status: "updated",
			},
			{
				title: "Button",
				href: "/docs/core/components/button",
				status: "updated",
			},
			{
				title: "Checkbox",
				href: "/docs/core/components/checkbox",
				status: "updated",
			},
			{
				title: "Collapsible",
				href: "/docs/core/components/collapsible",
				status: "updated",
			},
			{
				title: "Combobox",
				href: "/docs/core/components/combobox",
				status: "updated",
			},
			{
				title: "Context Menu",
				href: "/docs/core/components/context-menu",
				status: "updated",
			},
			{
				title: "Dialog",
				href: "/docs/core/components/dialog",
				status: "updated",
			},
			{
				title: "Dropdown Menu",
				href: "/docs/core/components/dropdown-menu",
				status: "updated",
			},
			{
				title: "Hover Card",
				href: "/docs/core/components/hover-card",
				status: "updated",
			},
			{
				title: "Image",
				href: "/docs/core/components/image",
				status: "updated",
			},
			{
				title: "Link",
				href: "/docs/core/components/link",
				status: "updated",
			},
			{
				title: "Menubar",
				href: "/docs/core/components/menubar",
				status: "updated",
			},
			{
				title: "Number Field",
				href: "/docs/core/components/number-field",
				status: "updated",
			},
			{
				title: "Pagination",
				href: "/docs/core/components/pagination",
				status: "updated",
			},
			{
				title: "Popover",
				href: "/docs/core/components/popover",
				status: "updated",
			},
			{
				title: "Progress",
				href: "/docs/core/components/progress",
				status: "updated",
			},
			{
				title: "Radio Group",
				href: "/docs/core/components/radio-group",
				status: "updated",
			},
			{
				title: "Select",
				href: "/docs/core/components/select",
				status: "updated",
			},
			{
				title: "Separator",
				href: "/docs/core/components/separator",
				status: "updated",
			},
			{
				title: "Skeleton",
				href: "/docs/core/components/skeleton",
				status: "updated",
			},
			{
				title: "Slider",
				href: "/docs/core/components/slider",
				status: "updated",
			},
			{
				title: "Switch",
				href: "/docs/core/components/switch",
				status: "updated",
			},
			{
				title: "Tabs",
				href: "/docs/core/components/tabs",
				status: "updated",
			},
			{
				title: "Text Field",
				href: "/docs/core/components/text-field",
				status: "updated",
			},
			{
				title: "Toast",
				href: "/docs/core/components/toast",
				status: "updated",
			},
			{
				title: "Toggle Button",
				href: "/docs/core/components/toggle-button",
				status: "updated",
			},
			{
				title: "Toggle Group",
				href: "/docs/core/components/toggle-group",
				status: "new",
			},
			{
				title: "Tooltip",
				href: "/docs/core/components/tooltip",
				status: "updated",
			},
			{
				title: "I18nProvider",
				href: "/docs/core/components/i18n-provider",
				status: "updated",
			},
		],
	},
];

export default function CoreLayout(props: RouteProps<string>) {
	return <Layout navSections={CORE_NAV_SECTIONS}>{props.children}</Layout>;
}
