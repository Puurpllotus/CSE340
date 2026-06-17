import { getAllProjects, getProjectById, isUserVolunteering } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { addVolunteer, removeVolunteer } from '../models/projects.js';

// Show list of all projects
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};  

// Show details for a specific project along with its category tags
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getCategoriesByProjectId(projectId);
        const title = project.title;

        // Determine if the currently logged-in user is already volunteering
        let isVolunteering = false;
        if (req.session && req.session.user) {
            isVolunteering = await isUserVolunteering(req.session.user.user_id, projectId);
        }

        res.render('project', { title, project, categories, isVolunteering });
    } catch (error) {
        next(error);
    }
};

export { showProjectsPage, showProjectDetailsPage };

// Action to volunteer for a project
export const handleVolunteerSignup = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;

    try {
        await addVolunteer(userId, id);
        if (req.flash) req.flash('success', 'Thank you for volunteering!');
        res.redirect(`/project/${id}`); // Fixed from /projects/ to /project/
    } catch (error) {
        console.error('Error adding volunteer:', error);
        res.redirect(`/project/${id}`); // Fixed from /projects/ to /project/
    }
};

// Action to cancel volunteering
export const handleVolunteerCancel = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.user_id;
    // Check if the request came from the dashboard or the details page
    const redirectTarget = req.query.redirect === 'dashboard' ? '/dashboard' : `/project/${id}`; // Fixed from /projects/ to /project/

    try {
        await removeVolunteer(userId, id);
        if (req.flash) req.flash('success', 'You have been removed as a volunteer.');
        res.redirect(redirectTarget);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        res.redirect(redirectTarget);
    }
};