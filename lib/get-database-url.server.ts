function getDatabaseUrl(dbName: string | null): string | null {
	return dbName ? `${dbName}-${process.env.TURSO_ORG_NAME}.turso.io` : null;
}

export default getDatabaseUrl;
