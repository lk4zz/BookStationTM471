const jwt = require('jsonwebtoken');

const verifyToken = (req, res,next) => {

    const authHeader = req.header('Authorization')       //look for authroization header in the request

    if (!authHeader) {
        return res.status(401).json({error: 'Access denied. No token provided.'})   //if not found
    }
    
    const token = authHeader.split(' ')[1];    //cleans form 

    if(!token) { 
        return res.status(401).json({error: 'Access denied. Token format is invalid.'})
    }

    try { 
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified
        next();
    } catch (error) {
        // If the signature is wrong, or 24 hours have passed
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

const verifyTokenOptional = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If there's no token at all, just move to the next station as a Guest
    if (!token) {
        req.user = null;
        return next();
    }

    // if there is token verify it 
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // if the token is expired or fake kick them out
            return res.status(403).json({ 
                success: false, 
                message: "Invalid or expired token. Please log in again." 
            });
        }
        
        // Success! Attach the user just like the strict bouncer does
        req.user = decoded;
        next();
    });
    
};

module.exports = {
    verifyToken,
    verifyTokenOptional
};

