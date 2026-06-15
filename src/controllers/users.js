import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

export const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

export const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        if (req.flash) req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        if (req.flash) req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

export const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' }); 
};

export const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            if (req.flash) req.flash('success', 'Login successful!');

            if (process.env.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/');
        } else {
            if (req.flash) req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        if (req.flash) req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

export const processLogout = async (req, res) => {
    if (req.session && req.session.user) {
        delete req.session.user;
    }
    if (req.flash) req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

export const showUsersManagementPage = async (req, res) => {
    try {
        const userList = await getAllUsers();
        res.render('users-list', { 
            title: 'User Management', 
            users: userList 
        });
    } catch (error) {
        console.error('Failed to load user list:', error);
        res.redirect('/dashboard');
    }
};