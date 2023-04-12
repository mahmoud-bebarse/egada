const { Error } = require('../models/error.js');
const { Response } = require('../models/response.js');

const authorize = (roles = []) => {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [

        // authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).send(
                    Response("401", {}, Error("401", "Unauthorized")));
            }

            // authentication and authorization successful
            next();
        }
    ];
}

exports.authorize = authorize;