import pg from 'pg';
const { Pool } = pg;

// If process.env.DATABASE_URL exists (like it does on Render), use it.
// Otherwise, we explicitly fall back to a local string for your local machine.
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/your_local_db';

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
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