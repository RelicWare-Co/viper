import { createClient} from "@tursodatabase/api";

export const turso = createClient({
    token: <string> process.env.TURSO_PLATFORM_TOKEN,
    org: <string> process.env.TURSO_ORG_NAME,
  });