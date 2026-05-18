import pg from 'pg';
const { Pool } = pg;

// Connection initialization points directly to your environment string
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/**
 * Fetches all categories from the database sorted alphabetically
 * @returns {Promise<Array>} Array of category objects
 */
export const getAllCategories = async () => {
    const query = 'SELECT category_id, name FROM category ORDER BY name ASC;';
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories model:", error);
        throw error;
    }
};