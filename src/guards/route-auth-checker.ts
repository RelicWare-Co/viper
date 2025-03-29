import { redirect } from "@tanstack/react-router";
import { orgCheck } from "./org-check.telefunc";
export async function routeAuthChecker() {
	const result = await orgCheck();
	console.log("doing auth check");
	console.log(result);
	if (result.error) {
		if (result.error.code === "NO_AUTH") {
			throw redirect({
				to: "/auth",
			});
		}
	}
}
