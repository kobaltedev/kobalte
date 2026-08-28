import { Navigate, redirect } from "@solidjs/router";

const target = "/docs/core/overview/introduction";

export const route = {
	preload() {
		return redirect(target);
	},
};

export function GET() {
	throw redirect(target);
}

export default function () {
	return <Navigate href={target} />;
}
