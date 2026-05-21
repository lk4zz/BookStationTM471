const prisma = require("../db");
const { ROLE } = require("../utils/checkers/checkUserRole");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

/**
 * Validates if the requesting admin has the authority to modify the target user.
 * Assumes req.user is populated by your authentication middleware.
 */
const validateUserModification = async (req, res, next) => {
    try {
        const targetUserId = parseInt(req.params.userId || req.body.userId, 10);
        const { roleId: actorRoleId, userId: actorId } = req.user;
        const requestedRoleId = req.body.roleId ? parseInt(req.body.roleId, 10) : null;

        if (isNaN(targetUserId)) throw new BadRequestError("Invalid user ID");
        if (actorId === targetUserId) throw new BadRequestError("You cannot modify your own account.");

        // Fetch target user to check their current role
        const target = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: { roleId: true }
        });

        if (!target) throw new NotFoundError("User not found");

        // Hierarchy protection rules
        if (target.roleId === ROLE.SUPER_ADMIN) {
            throw new ForbiddenError("Super admin accounts cannot be modified from the dashboard.");
        }
        
        if (target.roleId === ROLE.ADMIN && actorRoleId !== ROLE.SUPER_ADMIN) {
            throw new ForbiddenError("Only a super admin can modify other admin accounts.");
        }

        if (requestedRoleId === ROLE.ADMIN && actorRoleId !== ROLE.SUPER_ADMIN) {
            throw new ForbiddenError("Only a super admin can grant admin access.");
        }

        // Optional: Attach target to req object to save a DB query in the service layer
        req.targetUser = target; 

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateUserModification
};