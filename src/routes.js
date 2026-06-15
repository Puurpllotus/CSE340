import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, buildAddCategory, registerCategory, buildEditCategory, updateCategoryData } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { categoryRules } from './utilities/category-validation.js';
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout, 
    requireLogin,
    showDashboard,
    showUsersManagementPage 
} from './controllers/users.js';

import { requireRole } from './utilities/auth-middleware.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Create Category Routes
router.get('/new-category', buildAddCategory);
router.post('/new-category', categoryRules(), registerCategory);

// Edit Category Routes
router.get('/edit-category/:id', buildEditCategory);
router.post('/edit-category/:id', categoryRules(), updateCategoryData);

router.get('/test-error', testErrorPage);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login and logout routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// Admin Protected Route
router.get('/users', requireLogin, requireRole('admin'), showUsersManagementPage);

export default router;