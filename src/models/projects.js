import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/your_local_db';

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

/**
 * Fetches the next five upcoming service projects along with the parent organization name
 */
export const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.organization_id,
            o.name AS organization_name
        FROM project p
        INNER JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC
        LIMIT 5;
    `;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error);
        throw error;
    }
};

/**
 * Fetches service projects associated with a specific organization
 */
export const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date as date
        FROM project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;
    try {
        const result = await pool.query(query, [organizationId]);
        return result.rows;
    } catch (error) {
        console.error("Error in getProjectsByOrganizationId model:", error);
        throw error;
    }
};

/**
 * Retrieve a single project by its ID along with its organization details
 */
export const getProjectById = async (projectId) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.organization_id,
            o.name AS organization_name
        FROM project p
        INNER JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    try {
        const result = await pool.query(query, [projectId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error in getProjectById model:", error);
        throw error;
    }
};

/**
 * Retrieve all service projects for a given category
 */
export const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date
        FROM project p
        INNER JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC;
    `;
    try {
        const result = await pool.query(query, [categoryId]);
        return result.rows;
    } catch (error) {
        console.error("Error in getProjectsByCategoryId model:", error);
        throw error;
    }
};
/**
 * Add a user as a volunteer for a project
 */
export const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id) 
        VALUES ($1, $2) 
        ON CONFLICT DO NOTHING
    `;
    await pool.query(query, [userId, projectId]);
};

/**
 * Remove a user as a volunteer from a project
 */
export const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers 
        WHERE user_id = $1 AND project_id = $2
    `;
    await pool.query(query, [userId, projectId]);
};

/**
 * Get all projects a specific user has volunteered for
 */
export const getVolunteeredProjects = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description 
        FROM project p
        INNER JOIN project_volunteers pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

/**
 * Check if a specific user is currently volunteering for a specific project
 */
export const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM project_volunteers 
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await pool.query(query, [userId, projectId]);
    return result.rows.length > 0;
};