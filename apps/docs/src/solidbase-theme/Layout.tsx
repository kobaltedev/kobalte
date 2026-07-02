import { DefaultThemeComponentsProvider } from "@kobalte/solidbase/default-theme/context.jsx";
import { useDefaultThemeFrontmatter } from "@kobalte/solidbase/default-theme/frontmatter.js";
import Layout from "@kobalte/solidbase/default-theme/Layout.jsx";
import { type ComponentProps } from "solid-js";


export default function (props: ComponentProps<typeof Layout>) {
	const frontmatter = useDefaultThemeFrontmatter();

	return (
		<>
			<DefaultThemeComponentsProvider
				components={{
				}}
			>
				<Layout {...props} />
			</DefaultThemeComponentsProvider>
		</>
	);
}
