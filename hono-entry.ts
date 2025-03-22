import { vikeHandler } from "./server/vike-handler";
import { telefuncHandler } from "./server/telefunc-handler";
import { Hono } from "hono";
import { serveStatic} from "hono/bun"
import { auth } from "./server/auth";
const app = new Hono();

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

export default app;
