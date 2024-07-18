const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const requireAuth = async (req, res, next) => {
    // Destructure the authorization header from the request
    const { authorization } = req.headers;

    // Check if the authorization header is present
    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    // Extract the token from the authorization header
    const token = authorization.split(' ')[1];

    try {
        // Verify the token and extract the user ID
        const { _id } = jwt.verify(token, process.env.SECRET);

        // Find the user by ID and attach the user info to the request object
        req.user = await User.findOne({ _id }).select('_id');

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Authorization error:', error.message);
        res.status(401).json({ error: 'Not authorized' });
    }
};

module.exports = requireAuth;
