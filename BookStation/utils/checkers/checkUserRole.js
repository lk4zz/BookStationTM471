const ROLE = {
    READER: 1,
    AUTHOR: 2,
    ADMIN: 3,
    SUPER_ADMIN: 4,
};

const checkUserRole = (roleId) => {
    if (roleId === ROLE.READER) return "Reader";
    if (roleId === ROLE.AUTHOR) return "Author";
    if (roleId === ROLE.ADMIN) return "Admin";
    if (roleId === ROLE.SUPER_ADMIN) return "Super Admin";
    return "Admin";
};

const isAdminRole = (roleId) => {
    const parsed = parseInt(roleId, 10);
    return parsed === ROLE.ADMIN || parsed === ROLE.SUPER_ADMIN;
};

module.exports = { checkUserRole, isAdminRole, ROLE };
