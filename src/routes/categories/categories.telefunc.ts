import { eq } from "drizzle-orm";
import { categories } from "@/database/schema";
import getDB from "@/lib/get-db";

export async function onCreateCategory(categoryName: string, categoryDescription: string) {
    const db = getDB();
    const category = await db.insert(categories).values({ name: categoryName, description: categoryDescription })
    return category;
}

export async function onGetCategories() {
    const db = getDB();
    const result = await db.select().from(categories);
    return result;
}

export async function onCheckCategoryExists(categoryName: string): Promise<boolean> {
    const db = getDB(); 
    try {
        const existingCategory = await db.query.categories.findFirst({
            where: eq(categories.name, categoryName)
        })
        return !!existingCategory;
    } catch (error) {
        console.error("Error checking category existense:", error);
        throw error;
    }
}