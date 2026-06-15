-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Categories Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ========================================
-- Projects Table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    organization_id INT NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY(organization_id) 
        REFERENCES organization(organization_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_category 
        FOREIGN KEY(category_id) 
        REFERENCES category(category_id) 
        ON DELETE RESTRICT
);

-- ========================================
-- Insert Sample Data for Categories & Projects
-- ========================================
INSERT INTO category (category_name) 
VALUES ('Community Outreach'), ('Environmental'), ('Education');

INSERT INTO project (title, description, organization_id, category_id)
VALUES 
('Eco Pavilion Build', 'Constructing an eco-friendly community center.', 1, 2),
('Neighborhood Community Garden', 'Setting up seasonal hydroponic raised beds.', 2, 2);

-- ========================================
-- Roles Table
-- ========================================
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO NOTHING;

-- ========================================
-- Users Table
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);