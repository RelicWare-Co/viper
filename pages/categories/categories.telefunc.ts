import { categories } from "../../database/schema";
import getDB from "../../lib/get-db";

export async function onCreateCategory(categoryName: string, categoryDescription: string) {
    const db = getDB();
    const category = await db.insert(categories).values({ name: categoryName, description: categoryDescription })
    return category;
}

export async function onGetCategories(){
    const db = getDB();
    const categories = await db.query.categories.findMany();
    return categories;
}