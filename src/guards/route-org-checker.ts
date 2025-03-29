import { redirect } from "@tanstack/react-router";
import { orgCheck } from "./org-check.telefunc";
export async function routeOrgChecker() {
	const result = await orgCheck();
	console.log("doing org check", result);
	if (result.error) {
		if (result.error.code === "NO_AUTH") {
			throw redirect({
				to: "/auth",
				});
			}
			if (result.error.code === "NO_ORG") {
				return redirect({
					to: "/orgs",
				});
			}
		}
}
