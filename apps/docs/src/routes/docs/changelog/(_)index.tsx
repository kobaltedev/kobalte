import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

const target = "./2-0-x";

export default function Redirect() {
	const navigate = useNavigate();
	createEffect(
		() => target,
		() => navigate(target, { replace: true }),
	);
	return null;
}
