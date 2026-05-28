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
 * Fetches all service projects joined with their parent organization names
 * @returns {Promise<Array>} Array of project objects
 */
export const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM project p
        INNER JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC;
    `;

    try {
        const db = getPool();
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error);
        throw error;
    }
};