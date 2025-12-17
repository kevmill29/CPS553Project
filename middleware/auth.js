// middleware/auth.js

const jwt = require('jsonwebtoken');

// WARNING: Replace 'YOUR_JWT_SECRET' with the actual secret key used for signing tokens in your auth controller.
const JWT_SECRET = 'YOUR_JWT_SECRET'; 

exports.protect = (req, res, next) => {
    // 1. Get token from header (e.g., "Authorization: Bearer <token>")
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route. Missing token.' });
    }

    try {
        // 3. Verify the token
        // This decodes the JWT and checks its expiration/signature.
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. Extract User ID and attach it to the request object
        // Assuming your JWT payload contains 'id' (the user's database ID)
        req.userID = decoded.id; 

        // 5. Proceed to the next middleware or the controller function
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
};