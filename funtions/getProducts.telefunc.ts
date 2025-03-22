import getDB from "../lib/get-db";

export async function getProducts() {
    const db = getDB();
    const products = await db.query.products.findMany();
    return products;
}