import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/your_local_db';

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

/**
 * Fetches all organizations from the database sorted alphabetically
 */
export const getAllOrganizations = async () => {
    const query = 'SELECT organization_id, name, description, contact_email, logo_filename FROM organization ORDER BY name ASC;';
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllOrganizations model:", error);
        throw error;
    }
};

/**
 * Fetches details of a specific organization by its ID
 */
export const getOrganizationDetails = async (organizationId) => {
    const query = `
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM organization
      WHERE organization_id = $1;
    `;

    try {
        const result = await pool.query(query, [organizationId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error in getOrganizationDetails model:", error);
        throw error;
    }
};