// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    // Static fallback matching the organizations data structure required by the view
    const organizations = [
        { name: 'BrightFuture Builders', email: 'info@brightfuture.org', logo: '/images/brightfuture-logo.png' },
        { name: 'GreenHarvest Growers', email: 'contact@greenharvest.org', logo: '/images/greenharvest-logo.png' },
        { name: 'UnityServe Volunteers', email: 'hello@unityserve.org', logo: '/images/unityserve-logo.png' }
    ];
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

// Export any controller functions
export { showOrganizationsPage };