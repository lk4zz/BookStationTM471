const checkUserRole = (roleId) => {
    let role;
    if (roleId === 1) {
        role = "User";
    }
    else if (roleId === 2) {
        role = "Author";
    }
    else {
        role = "Admin";
    }
    return role;
}

module.exports = { checkUserRole };