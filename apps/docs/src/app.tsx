import { pageRoutes } from "virtual:file-routes";
import { Toast } from "@kobalte/core/toast";
import { SolidBaseRoot } from "@kobalte/solidbase/client";
import { createRouter } from "@solidjs/router";
import { fileRoutes } from "@solidjs/router/fs";
import { Loading, Portal } from "@solidjs/web";
import toastStyles from "./examples/toast.module.css";

const Router = createRouter({
	routes: fileRoutes(pageRoutes),
	// Vite's base ends with a slash ("/docs/"), which the router would keep when
	// resolving links ("/docs//guide"), so pass it without one.
	base: import.meta.env.BASE_URL.replace(/\/$/, ""),
});

export default function App() {
	return (
		<Router>
			{(props) => (
				<SolidBaseRoot>
					<Loading>{props.children}</Loading>

					<Portal>
						<Toast.Region>
							<Toast.List class={toastStyles.toast__list} />
						</Toast.Region>
						<Toast.Region regionId="custom-region-id">
							<Toast.List class={toastStyles["toast__list-custom-region"]} />
						</Toast.Region>
					</Portal>
				</SolidBaseRoot>
			)}
		</Router>
	);
}
