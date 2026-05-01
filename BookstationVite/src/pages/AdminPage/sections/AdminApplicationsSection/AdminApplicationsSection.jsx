// sections/AdminApplicationsSection/AdminApplicationsSection.jsx
import React from 'react';
import { usePendingApplications } 
from '../../../../hooks/adminHooks/useAdminQueries'; // Adjust path as needed
import { useReviewApplication } from '../../../../hooks/adminHooks/useAdminMutations';
import styles from './AdminApplicationsSection.module.css';

export const AdminApplicationsSection = () => {
  const { applications, isLoading, isError, error } = usePendingApplications();
  const reviewMutation = useReviewApplication();

  const handleReview = (applicationId, status) => {
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) {
      reviewMutation.mutate({ applicationId, status });
    }
  };

  if (isLoading) return <div>Loading applications...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  if (applications.length === 0) {
    return <div className={styles.emptyState}>No pending author applications.</div>;
  }

  return (
    <div className={styles.applicationsContainer}>
      <h2 className={styles.heading}>Pending Author Requests</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Pen Name</th>
              <th>Intent</th>
              <th>Document</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>
                  <div>{app.user.name}</div>
                  <div className={styles.subtext}>{app.user.email}</div>
                </td>
                <td>{app.penName}</td>
                <td className={styles.intentCell}>{app.writingIntent}</td>
                <td>
                  {app.documentUrl ? (
                    <a href={`/${app.documentUrl}`} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                      View Proof
                    </a>
                  ) : (
                    <span className={styles.subtext}>None</span>
                  )}
                </td>
                <td className={styles.actionCell}>
                  <button 
                    className={`${styles.actionBtn} ${styles.approveBtn}`}
                    onClick={() => handleReview(app.id, 'APPROVED')}
                    disabled={reviewMutation.isPending}
                  >
                    Approve
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.rejectBtn}`}
                    onClick={() => handleReview(app.id, 'REJECTED')}
                    disabled={reviewMutation.isPending}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};