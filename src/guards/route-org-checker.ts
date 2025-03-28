import { redirect } from "@tanstack/react-router";
import { orgCheck } from "./org-check.telefunc";
import { actionResultToResult } from "@/lib/result";
export async function routeOrgChecker() {
	const result = actionResultToResult(await orgCheck());
	console.log("doing org check");
	if (result.isErr()) {
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
