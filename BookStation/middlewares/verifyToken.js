const jwt = require('jsonwebtoken');
const prisma = require('../db');
const { checkIfBanned } = require("./checkBanned");
const { ROLE } = require('../utils/checkers/checkUserRole');

const verifyToken = (req, res, next) => {

    const authHeader = req.header('Authorization')       //look for authroization header in the request

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' })   //if not found
    }

    const token = authHeader.split(' ')[1];    //cleans form 

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token format is invalid.' })
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

const verifyAuthor = async (req, res, next) => {
    try {
        // 1. Guard Clause: Ensure req.user exists before trying to read from it
        if (!req.user) {
            return res.status(401).json({ error: "Access denied. Please log in." });
        }

        // 2. Extract ID safely (checks both 'userId' and 'id' just in case token shapes vary)
        const rawUserId = req.user.userId || req.user.id;
        const userId = parseInt(rawUserId, 10);

        // 3. Prevent Prisma crash: Ensure userId is an actual number
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user identifier." });
        }

        // 4. Database query
        const userCheck = await prisma.user.findUnique({
            where: { id: userId },
            select: { roleId: true },
        });

        if (!userCheck) {
            return res.status(404).json({ error: "User not found in database." });
        }

        req.user.freshRoleId = userCheck.roleId;

        // 5. Role validation — Author, Admin, or Super Admin may author content
        const allowed =
            userCheck.roleId === ROLE.AUTHOR ||
            userCheck.roleId === ROLE.ADMIN ||
            userCheck.roleId === ROLE.SUPER_ADMIN;

        if (!allowed) {
            return res.status(403).json({ error: "Forbidden. Author access required." });
        }

        next();
    } catch (error) {
        // 6. Catch all other errors (DB timeouts, etc.) so the server doesn't crash
        console.error("Error in verifyAuthor middleware:", error);
        return res.status(500).json({ error: "Internal server error during authorization check." });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        // 1. Guard Clause: Ensure req.user exists
        if (!req.user) {
            return res.status(401).json({ error: "Access denied. Please log in." });
        }

        // 2. Extract ID safely
        const rawUserId = req.user.userId || req.user.id;
        const userId = parseInt(rawUserId, 10);

        // 3. Prevent Prisma crash: Ensure userId is a number
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user identifier." });
        }

        // 4. Fetch the fresh user role from the database
        const userCheck = await prisma.user.findUnique({
            where: { id: userId },
            select: { roleId: true },
        });

        if (!userCheck) {
            return res.status(404).json({ error: "User not found in database." });
        }

        req.user.freshRoleId = userCheck.roleId;

        // 5. Admin or Super Admin
        const isAdmin =
            userCheck.roleId === ROLE.ADMIN ||
            userCheck.roleId === ROLE.SUPER_ADMIN;

        if (!isAdmin) {
            return res.status(403).json({ error: "Forbidden. Admin access required." });
        }

        next();
    } catch (error) {
        // 6. Catch all errors to prevent server crashes
        console.error("Error in verifyAdmin middleware:", error);
        return res.status(500).json({ error: "Internal server error during admin authorization check." });
    }
};

const verifySuperAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Access denied. Please log in." });
        }

        const rawUserId = req.user.userId || req.user.id;
        const userId = parseInt(rawUserId, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user identifier." });
        }

        const userCheck = await prisma.user.findUnique({
            where: { id: userId },
            select: { roleId: true },
        });

        if (!userCheck) {
            return res.status(404).json({ error: "User not found in database." });
        }

        req.user.freshRoleId = userCheck.roleId;

        if (userCheck.roleId !== ROLE.SUPER_ADMIN) {
            return res.status(403).json({ error: "Forbidden. Super admin access required." });
        }

        next();
    } catch (error) {
        console.error("Error in verifySuperAdmin middleware:", error);
        return res.status(500).json({ error: "Internal server error during super admin authorization check." });
    }
};

/** Guest-friendly routes: optional JWT then ban check if token present */
const optionalAuthWithBanCheck = [verifyTokenOptional, checkIfBanned];

const requireAuthor = [verifyToken, checkIfBanned, verifyAuthor];
const requireAdmin = [verifyToken, checkIfBanned, verifyAdmin];
const requireSuperAdmin = [verifyToken, checkIfBanned, verifySuperAdmin];

/** Shorthand: verify JWT then reject banned accounts */
const requireTokenWithBan = [verifyToken, checkIfBanned];

module.exports = {
    verifyToken,
    verifyTokenOptional,
    checkIfBanned,
    verifyAuthor,
    verifyAdmin,
    verifySuperAdmin,
    optionalAuthWithBanCheck,
    requireTokenWithBan,
    requireAuthor,
    requireAdmin,
    requireSuperAdmin,
};
