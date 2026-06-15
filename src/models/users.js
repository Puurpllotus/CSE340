import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/your_local_db';

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

/**
 * Inserts a new user into the database and assigns them the default 'user' role
 */
export const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].user_id;
};

/**
 * Helper to find a user by their email string
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id 
        FROM users 
        WHERE email = $1
    `;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
};

/**
 * Helper to compare plaintext passwords against a hash profile
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Validates incoming login credentials
 */
export const authenticateUser = async (email, password) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) return null;

        const isMatch = await verifyPassword(password, user.password_hash);
        if (!isMatch) return null;

        delete user.password_hash;
        return user;
    } catch (error) {
        console.error('Error in authenticateUser model:', error);
        throw error;
    }
};

/**
 * W05 Assignment: Fetches all registered users along with their role names
 */
export const getAllUsers = async () => {
    const query = `
        SELECT 
            u.user_id, 
            u.name, 
            u.email, 
            r.role_name as role
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name ASC;
    `;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllUsers model:", error);
        throw error;
    }
};