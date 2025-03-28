import createLibsqlClient from "../lib/create-libsql-client";
import getDatabaseUrl from "../lib/get-database-url.server";
import { drizzle } from "drizzle-orm/libsql";
import { turso } from "../lib/tursoclient.server";
import * as schema from "@/database/schema";
import { migrate } from "drizzle-orm/libsql/migrator";

export async function createOrgDatabase(orgId: string) {
	console.time("createOrgDatabase-hash");
	const hasher = new Bun.CryptoHasher("ripemd160");
	hasher.update(orgId);
	const hash = hasher.digest("hex");
	console.log("hash", hash);
	console.timeEnd("createOrgDatabase-hash");
    try {
        const db = await turso.databases.create(hash, {
            group: "viper",
        });
    } catch (error) {
        console.log("Error creating database")
    }
	const dbUrl = `libsql://${getDatabaseUrl(hash)}`;
	const client = createLibsqlClient(dbUrl);
	const dbclient = drizzle(client, {
		schema,
	});
	try {
		await migrate(dbclient, { migrationsFolder: "./drizzle" });
		console.log("Database migrated successfully");
	} catch (error) {
		console.error(error);
	}
}
