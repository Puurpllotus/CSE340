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
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error);
        throw error;
    }
};