import { drizzle } from "drizzle-orm/libsql";
import createLibsqlClient from "./create-libsql-client";
import * as schema from "../database/schema";
import { getContext } from "telefunc";

function getDB() {
    const context = getContext<{ session: { activeOrganizationSlug: string | null } }>();
    const orgSlug = context.session.activeOrganizationSlug;
    if (!orgSlug) {
        throw new Error("No active organization slug found");
    }
    const url = `libsql://${orgSlug}-${process.env.TURSO_ORG_NAME}.turso.io`;
    const client = createLibsqlClient(url);
    return drizzle(client, { schema });
}

export default getDB;
