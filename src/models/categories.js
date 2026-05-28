import pg from 'pg';
const { Pool } = pg;

let pool;
function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
        });
    }
    return pool;
}

/**
 * Fetches all categories from the database sorted alphabetically
 * @returns {Promise<Array>} Array of category objects
 */
export const getAllCategories = async () => {
    const query = 'SELECT category_id, name FROM category ORDER BY name ASC;';
    try {
        const db = getPool();
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories model:", error);
        throw error;
    }
};