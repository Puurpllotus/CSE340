/**
 * Middleware to check if a user is logged in
 */
export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        if (req.flash) req.flash('error', 'You must log in to view that page.');
        return res.redirect('/login');
    }
    next();
};

/**
 * Middleware to restrict access to specific roles (like admin)
 */
export const requireRole = (allowedRole) => {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role !== allowedRole) {
            if (req.flash) req.flash('error', 'Access denied. Authorized users only.');
            return res.redirect('/dashboard');
        }
        next();
    };
};