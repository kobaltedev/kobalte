import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

const target = "./introduction";

export default function Redirect() {
	const navigate = useNavigate();
	createEffect(
		() => target,
		() => navigate(target, { replace: true }),
	);
	return null;
}
