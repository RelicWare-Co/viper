// server.ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";
import { auth } from "./auth";
import { telefuncHandler } from "./telefunc-handler";

const isProd = process.env.NODE_ENV === "production";
let html = await readFile(isProd ? "build/index.html" : "index.html", "utf8");

if (!isProd) {
	// Inject Vite client code to the HTML
	html = html.replace(
		"<head>",
		`
    <script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>

    <script type="module" src="/@vite/client"></script>
    `,
	);
}

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>();

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.post("/_telefunc", telefuncHandler);
app.use("/assets/*", serveStatic({ root: isProd ? "build/" : "./" })); // path must end with '/'
app.get("/*", (c) => c.html(html));

export default app;

if (isProd) {
	serve({ ...app, port: 4000 }, (info) => {
		console.log(`Listening on http://localhost:${info.port}`);
	});
}
