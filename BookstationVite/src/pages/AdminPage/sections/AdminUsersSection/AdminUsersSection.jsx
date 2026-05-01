import styles from "./AdminUsersSection.module.css";

export function AdminUsersSection({
  users,
  onBanUser,
  isBanning,
  showHeading = true,
  platformHasNoUsers = false,
  searchQuery = "",
  onChangeRole,
  isChangingRole = false,
}) {
  if (!users || users.length === 0) {
    const msg =
      platformHasNoUsers && !String(searchQuery).trim()
        ? "No regular users on the platform."
        : "No users match this search.";
    return <div className={styles.empty}>{msg}</div>;
  }

  return (
    <div className={styles.section}>
      {showHeading ? <h2 className={styles.heading}>Platform users</h2> : null}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.coinBalance || 0}</td>
                <td>
                  <select
                    className={styles.banBtn}
                    disabled={isChangingRole}
                    value={String(user.roleId)}
                    onChange={(e) => {
                      const newRole = Number(e.target.value);
                      onChangeRole({
                        userId: Number(user.id),
                        roleId: newRole
                      });
                    }}
                  >
                    <option value="1">Reader</option>
                    <option value="2">Author</option>
                  </select>
                  <button
                    className={styles.banBtn}
                    disabled={isBanning}
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to PERMANENTLY delete ${user.name}? This cannot be undone.`)) {
                        onBanUser(user.id);
                      }
                    }}
                  >
                    Ban User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}