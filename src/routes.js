import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, handleVolunteerSignup, handleVolunteerCancel } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, buildAddCategory, registerCategory, buildEditCategory, updateCategoryData } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { categoryRules } from './utilities/category-validation.js';

// Controller imports (requireLogin removed from here)
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout, 
    showDashboard,
    showUsersManagementPage 
} from './controllers/users.js';

// Security Middleware imports (requireLogin moved here)
import { requireLogin, requireRole } from './utilities/auth-middleware.js';

const router = express.Router();

// Public View Routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/test-error', testErrorPage);

// Protected Admin Category Routes 
router.get('/new-category', requireLogin, requireRole('admin'), buildAddCategory);
router.post('/new-category', requireLogin, requireRole('admin'), categoryRules(), registerCategory);
router.get('/edit-category/:id', requireLogin, requireRole('admin'), buildEditCategory);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryRules(), updateCategoryData);

// User Authentication Routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected User Dashboard Route
router.get('/dashboard', requireLogin, showDashboard);

// Protected Volunteer Signup Routes
router.post('/project/:id/volunteer', requireLogin, handleVolunteerSignup);
router.post('/project/:id/unvolunteer', requireLogin, handleVolunteerCancel);

// Protected Admin User Management Route
router.get('/users', requireLogin, requireRole('admin'), showUsersManagementPage);

export default router;