import { telefunc } from "telefunc";
import type { Context } from "hono";

// TODO: stop using universal-middleware and directly integrate server middlewares instead. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
export const telefuncHandler = async (c: Context) => {
  const httpResponse = await telefunc({
    url: c.req.url,
    method: c.req.method,
    body: await c.req.text(),
    context: {
      session: c.get("session"),
      user: c.get("user"),
      originalContext: c,
    },
  });
  const { body, statusCode, contentType } = httpResponse;
  return new Response(body, {
    status: statusCode,
    headers: {
      "content-type": contentType,
    },
  });
};
