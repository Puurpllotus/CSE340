import { body } from 'express-validator';

export const categoryRules = () => {
    return [
        body('category_name')
            .trim()
            .escape()
            .notEmpty().withMessage('Please provide a category name.')
            .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long.')
            .isLength({ max: 100 }).withMessage('Category name cannot be longer than 100 characters.')
    ];
};