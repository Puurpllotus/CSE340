import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/your_local_db';

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

/**
 * Fetches all categories from the database sorted alphabetically
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

/**
 * Retrieve a single category by its ID
 */
export const getCategoryById = async (categoryId) => {
    const query = 'SELECT category_id, name FROM category WHERE category_id = $1;';
    try {
        const result = await pool.query(query, [categoryId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error in getCategoryById model:", error);
        throw error;
    }
};

/**
 * Retrieve all categories for a given service project
 */
export const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name 
        FROM category c
        INNER JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;
    try {
        const result = await pool.query(query, [projectId]);
        return result.rows;
    } catch (error) {
        console.error("Error in getCategoriesByProjectId model:", error);
        throw error;
    }
};