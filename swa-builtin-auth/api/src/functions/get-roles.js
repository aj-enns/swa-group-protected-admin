const { app } = require('@azure/functions');

/**
 * Custom Role Assignment Function
 * 
 * This Azure Function is invoked by SWA after authentication to assign
 * custom roles to users. It's configured in staticwebapp.config.json
 * using the "rolesSource" property.
 * 
 * The function receives the user's identity claims and can return
 * additional roles based on your business logic.
 * 
 * Documentation: https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-custom
 */

// Define your admin users here
// In production, this would come from a database or external service
const ADMIN_USERS = [
    'user@example.com',
    // Add admin email addresses here
];

app.http('get-roles', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'get-roles',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            context.log('Role assignment request:', JSON.stringify(body, null, 2));

            // Extract user information from the request
            const { identityProvider, userId, userDetails, claims } = body;
            
            // Get user's email from claims
            const emailClaim = claims?.find(c => 
                c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' ||
                c.typ === 'preferred_username' ||
                c.typ === 'email'
            );
            const userEmail = emailClaim?.val || userDetails || '';

            // Determine roles based on your business logic
            const roles = [];

            // Check if user is an admin
            if (ADMIN_USERS.includes(userEmail.toLowerCase())) {
                roles.push('Admin');
                context.log(`Assigned Admin role to: ${userEmail}`);
            }

            // You can add more role logic here
            // Example: Check against a database, external API, or Azure AD groups
            
            // Return the roles
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roles })
            };
        } catch (error) {
            context.log('Error in role assignment:', error);
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roles: [] })
            };
        }
    }
});
