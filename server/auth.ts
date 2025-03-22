import { betterAuth } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { admin } from "better-auth/plugins"
import { organization } from "better-auth/plugins"


const dialect = new LibsqlDialect({
	url: process.env.TURSO_DATABASE_URL || "",
	authToken: process.env.TURSO_AUTH_TOKEN || "",
});

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: {
		dialect,
		type: "sqlite",
	},
	plugins: [admin(), organization()]
});
