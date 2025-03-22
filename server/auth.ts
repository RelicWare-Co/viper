import { betterAuth } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { admin } from "better-auth/plugins"
import { organization } from "better-auth/plugins"
import { createOrgDatabase } from "../funtions/createOrgDatabase.telefunc";


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
	plugins: [admin(), organization({
        organizationCreation: {
            disabled: false, // Set to true to disable organization creation
            afterCreate: async ({ organization, member, user }, request) => {
                // Run custom logic after organization is created
                // e.g., create default resources, send notifications
                await createOrgDatabase(organization.slug);
            }
        }
    })]
});
