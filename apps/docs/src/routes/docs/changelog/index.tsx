import { Navigate } from "@solidjs/router";
import { LATEST_CORE_CHANGELOG_URL } from "../../../VERSIONS";

export default function () {
	return <Navigate href={LATEST_CORE_CHANGELOG_URL} />;
}
