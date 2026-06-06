import { getAllCategories, getCategoryById, insertCategory, updateCategory } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';
import { validationResult } from 'express-validator';

// Show list of all categories
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};  

// Show details for a single category along with its associated service projects
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const categoryDetails = await getCategoryById(categoryId);

        if (!categoryDetails) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = `${categoryDetails.name} Projects`;

        res.render('category', { title, categoryDetails, projects });
    } catch (error) {
        next(error);
    }
};

// Deliver the blank create category form view
const buildAddCategory = async (req, res, next) => {
    res.render('categories/add-category', {
        title: 'Add New Category',
        errors: null,
        category_name: ''
    });
};

// Process the insertion of a new category
const registerCategory = async (req, res, next) => {
    const { category_name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('categories/add-category', {
            title: 'Add New Category',
            errors: errors.array(),
            category_name
        });
    }

    try {
        const result = await insertCategory(category_name);
        if (result) {
            req.flash('notice', `The ${category_name} category was successfully added.`);
            res.redirect('/categories');
        } else {
            req.flash('notice', 'Sorry, adding the category failed.');
            res.status(501).render('categories/add-category', {
                title: 'Add New Category',
                errors: null,
                category_name
            });
        }
    } catch (error) {
        next(error);
    }
};

// Deliver the pre-populated edit form view
const buildEditCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    try {
        const categoryData = await getCategoryById(categoryId);
        if (!categoryData) {
            req.flash('notice', 'Category not found.');
            return res.redirect('/categories');
        }
        res.render('categories/edit-category', {
            title: `Edit ${categoryData.name}`,
            errors: null,
            category_id: categoryData.category_id,
            category_name: categoryData.name
        });
    } catch (error) {
        next(error);
    }
};

// Process the modification update for a category
const updateCategoryData = async (req, res, next) => {
    const { category_id, category_name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('categories/edit-category', {
            title: `Edit ${category_name}`,
            errors: errors.array(),
            category_id,
            category_name
        });
    }

    try {
        const result = await updateCategory(category_id, category_name);
        if (result) {
            req.flash('notice', `The category was successfully updated to ${category_name}.`);
            res.redirect('/categories');
        } else {
            req.flash('notice', 'Sorry, the update failed.');
            res.status(501).render('categories/edit-category', {
                title: `Edit ${category_name}`,
                errors: null,
                category_id,
                category_name
            });
        }
    } catch (error) {
        next(error);
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    buildAddCategory, 
    registerCategory, 
    buildEditCategory, 
    updateCategoryData 
};