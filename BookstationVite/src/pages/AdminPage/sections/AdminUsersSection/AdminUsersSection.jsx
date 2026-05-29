import { useState } from "react";
import WarningModal from "../../../../GlobalComponents/Modals/WarningModal/WarningModal";
import { 
  ShieldAlert, 
  Shield, 
  Ban, 
  CheckCircle, 
  Mail, 
  Coins, 
  UserCircle 
} from "lucide-react";
import styles from "./AdminUsersSection.module.css";

const SUPER_ADMIN_ROLE_ID = 4;

export function AdminUsersSection({
  users,
  onBanUser,
  isBanning,
  showHeading = true,
  platformHasNoUsers = false,
  searchQuery = "",
  onChangeRole,
  isChangingRole = false,
  currentUserRoleId,
}) {
  const isSuperAdmin = currentUserRoleId === SUPER_ADMIN_ROLE_ID;
  const [userToBan, setUserToBan] = useState(null);

  if (!users || users.length === 0) {
    const msg =
      platformHasNoUsers && !String(searchQuery).trim()
        ? "No regular users on the platform."
        : "No users match this search.";
    return (
      <div className={styles.emptyState}>
        <UserCircle size={48} className={styles.emptyIcon} />
        <p>{msg}</p>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      {showHeading && (
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Platform Users</h2>
          <span className={styles.userCount}>{users.length} Total</span>
        </div>
      )}
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User Details</th>
              <th><div className={styles.thContent}><Mail size={14} /> Email</div></th>
              <th><div className={styles.thContent}><Coins size={14} /> Balance</div></th>
              <th><div className={styles.thContent}><Shield size={14} /> Role & Actions</div></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const rowLocked = user.roleId === 3 && !isSuperAdmin;

              return (
                <tr key={user.id} className={rowLocked ? styles.rowLocked : ""}>
                  <td className={styles.idCell}>#{user.id}</td>
                  
                  <td>
                    <div className={styles.userInfo}>

                      <div className={styles.userDetails}>
                        <span className={styles.userName}>{user.name}</span>
                        {user.isBanned ? (
                          <span className={`${styles.badge} ${styles.badgeSuspended}`}>
                            <Ban size={10} /> Suspended
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeActive}`}>
                            <CheckCircle size={10} /> Active
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className={styles.textMuted}>{user.email}</td>
                  
                  <td>
                    <span className={styles.balanceBadge}>
                      {user.coinBalance || 0}
                    </span>
                  </td>
                  
                  <td>
                    <div className={styles.actionsContainer}>
                      <select
                        className={styles.roleSelect}
                        disabled={isChangingRole || rowLocked}
                        value={String(user.roleId)}
                        onChange={(e) => {
                          const newRole = Number(e.target.value);
                          onChangeRole({
                            userId: Number(user.id),
                            roleId: newRole,
                          });
                        }}
                      >
                        <option value="1">Reader</option>
                        <option value="2">Author</option>
                        {isSuperAdmin && <option value="3">Admin</option>}
                      </select>

                      <button
                        type="button"
                        className={`${styles.actionBtn} ${user.isBanned ? styles.unbanBtn : styles.banBtn}`}
                        disabled={isBanning || rowLocked}
                        onClick={() => {
                          if (rowLocked) return;
                          setUserToBan(user);
                        }}
                        title={rowLocked ? "Insufficient permissions" : ""}
                      >
                        {user.isBanned ? (
                          <>Unban</>
                        ) : (
                          <>Ban <Ban size={14} /></>
                        )}
                      </button>
                      
                      {rowLocked && (
                        <ShieldAlert size={16} className={styles.lockIcon} title="Protected User" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {userToBan && (
        <WarningModal
          heading={userToBan.isBanned ? "Reinstate User?" : "Suspend User?"}
          message={
            userToBan.isBanned
              ? `Are you sure you want to reinstate access for ${userToBan.name}?`
              : `Suspend ${userToBan.name}? They will lose access to the platform until reinstated.`
          }
          onConfirm={() => {
            onBanUser(userToBan.id);
            setUserToBan(null);
          }}
          onClose={() => setUserToBan(null)}
          isPending={isBanning}
          confirmText={userToBan.isBanned ? "Reinstate User" : "Suspend User"}
        />
      )}
    </section>
  );
}