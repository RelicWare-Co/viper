import { vikeHandler } from "./server/vike-handler";
import { telefuncHandler } from "./server/telefunc-handler";
import { Hono } from "hono";
import { serveStatic} from "hono/bun"
import { auth } from "./server/auth";
const app = new Hono<{  
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null
	}
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

app.post("/_telefunc", telefuncHandler);
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.get("/*", serveStatic({
  root: "./dist/client/",
}));
/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
app.all("*", vikeHandler);

export default {
	port: 3000, 
	fetch: app.fetch, 
}