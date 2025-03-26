import { drizzle } from "drizzle-orm/libsql";
import createLibsqlClient from "./create-libsql-client";
import * as schema from "../database/schema";
import { getContext } from "telefunc";
import getDatabaseUrl from "./get-database-url.server";
import { getOrgIdHash } from "./get-orgid-hash.server";

function getDB() {
    const context = getContext<{ session: { activeOrganizationId: string | null } }>();
    const orgId = context.session.activeOrganizationId;
    if (!orgId) {
        throw new Error("No active organization id found");
    }
    const url = `libsql://${getDatabaseUrl(getOrgIdHash(orgId))}`;
    const client = createLibsqlClient(url);
    return drizzle(client, { schema });
}

export default getDB;
