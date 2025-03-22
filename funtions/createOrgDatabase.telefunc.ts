import createLibsqlClient from "../lib/create-libsql-client";
import getDatabaseUrl from "../lib/get-database-url.server";
import { drizzle } from "drizzle-orm/libsql";
import { turso } from "../lib/tursoclient.server";
import * as schema from "../database/schema";
import { migrate } from "drizzle-orm/libsql/migrator";

export async function createOrgDatabase(orgName: string) {
    const db = await turso.databases.create(orgName);
    const dbUrl = `libsql://${getDatabaseUrl(db.name)}`;
    const client = createLibsqlClient(dbUrl);
    const dbclient = drizzle(client,{
        schema
    })
    try {
        await migrate(dbclient, { migrationsFolder: "./drizzle" })
        console.log("Database migrated successfully");
    } catch (error) {
        console.error(error);
    }
}
