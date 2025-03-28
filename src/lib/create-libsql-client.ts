import { createClient } from "@libsql/client/http";

function createLibsqlClient(url: string) {
    return createClient({
        url,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });
}

export default createLibsqlClient;