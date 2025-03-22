import { betterAuth, type BetterAuthOptions } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { admin } from "better-auth/plugins"
import { organization } from "better-auth/plugins"
import { createOrgDatabase } from "../funtions/createOrgDatabase.telefunc";
import { customSession } from "better-auth/plugins";
import { createClient } from "@libsql/client";
const dialect = new LibsqlDialect({
	url: process.env.TURSO_DATABASE_URL || "",
	authToken: process.env.TURSO_AUTH_TOKEN || "",
});

const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
});

const options = {
    session: {
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // Cache duration in seconds
        },
      },
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
    }),
]
  } satisfies BetterAuthOptions;

export const auth = betterAuth({
    ...options,
    plugins: [
        ...(options.plugins ?? []),
        customSession(async ({ user, session }) => {
            // now both user and session will infer the fields added by plugins and your custom fields
            return {
                user,
                session: {
                    ...session,
                    activeOrganizationSlug: session.activeOrganizationId 
                        ? await client.execute(
                            "SELECT slug FROM organization WHERE id = ?",
                            [session.activeOrganizationId]
                          ).then((res) => res.rows[0]?.slug)
                        : null,
                },
            }
        }, options), // pass options here
    ]
});
