import getDB from "../lib/get-db";
import { eq } from "drizzle-orm";

export async function getProductsById(id: string) {
    const db = getDB();
    const product = await db.query.products.findFirst({
        where: (products) => eq(products.id, id)
    });
    return product;
}