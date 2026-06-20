import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

addons.setConfig({
	theme: create({
		base: "light",
		brandTitle: "Kobalte",
		brandImage: "/kobalte-logo.svg",
		brandUrl: "https://kobalte.dev",
		brandTarget: "_blank",
	}),
});
