import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
// Import data manager modules
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Static middleware to serve the public folder
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const title = 'Our Partner Organizations';
    res.render('organizations', { title });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    try {
        const projects = await getAllProjects();
        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Failed to render projects page:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Dynamic database integration for service categories
app.get('/categories', async (req, res) => {
    const title = 'Categories';
    try {
        const categories = await getAllCategories();
        res.render('categories', { title, categories });
    } catch (error) {
        // This line will print the exact database issue to your VS Code terminal
        console.error("--- DATABASE CRASH LOG ---", error); 
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});