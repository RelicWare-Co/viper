export function getOrgIdHash(orgId: string) {
    const hasher = new Bun.CryptoHasher("ripemd160");
    hasher.update(orgId);
    const hash = hasher.digest("hex");
    return hash;
}