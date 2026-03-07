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
        // If the signature is wrong, or 24 hours have passed...
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

module.exports = verifyToken;