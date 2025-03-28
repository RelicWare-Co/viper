import { redirect } from "@tanstack/react-router";
import { orgCheck } from "./org-check.telefunc";
import { actionResultToResult } from "@/lib/result";
export async function routeAuthChecker() {
	const result = actionResultToResult(await orgCheck());
	console.log("doing auth check");
	console.log(result);
	if (result.isErr()) {
		if (result.error.code === "NO_AUTH") {
			throw redirect({
				to: "/auth",
			});
		}
	}
}
