import React, { useState } from 'react';
import { usePendingApplications } from '../../../../hooks/adminHooks/useAdminQueries'; // Adjust path as needed
import { useReviewApplication } from '../../../../hooks/adminHooks/useAdminMutations';
import WarningModal from '../../../../GlobalComponents/Modals/WarningModal/WarningModal';
import { resolveDocumentUrl } from '../../../../utils/ImageUrl';
import { 
  Inbox, 
  UserCircle, 
  PenTool, 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Settings2,
  X
} from 'lucide-react';
import styles from './AdminApplicationsSection.module.css';

// --- Intent Modal Component ---
function IntentModal({ application, onClose }) {
  if (!application) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalHeading}>Writing Intent</h3>
            <p className={styles.modalSubheading}>Application by {application.penName}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </header>
        <div className={styles.modalBody}>
          <p className={styles.intentFullText}>{application.writingIntent}</p>
        </div>
        <footer className={styles.modalFooter}>
          <button className={styles.doneBtn} onClick={onClose}>
            Done Reading
          </button>
        </footer>
      </div>
    </div>
  );
}

export const AdminApplicationsSection = () => {
  const { applications, isLoading, isError, error } = usePendingApplications();
  const reviewMutation = useReviewApplication();
  
  const [reviewConfig, setReviewConfig] = useState(null);
  const [intentToView, setIntentToView] = useState(null); // State for the Intent Modal

  const handleReview = (applicationId, status) => {
    setReviewConfig({ applicationId, status });
  };

  if (isLoading) return <div className={styles.loadingState}>Loading applications...</div>;
  if (isError) return <div className={styles.errorState}>Error: {error.message}</div>;

  if (applications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Inbox size={48} className={styles.emptyIcon} />
        <p>No pending author applications. You're all caught up!</p>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.heading}>Author Applications</h2>
          <p className={styles.subheading}>Review and approve users requesting author privileges.</p>
        </div>
        <span className={styles.countBadge}>{applications.length} Pending</span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colUser}>User Details</th>
              <th className={styles.colIntent}><div className={styles.thContent}><PenTool size={14} /> Application Info</div></th>
              <th className={styles.colDoc}><div className={styles.thContent}><FileText size={14} /> Document</div></th>
              <th className={styles.colActions}><div className={styles.thContentEnd}><Settings2 size={14} /> Actions</div></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                
                {/* User Info Cell */}
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatarPlaceholder}>
                      <UserCircle size={24} />
                    </div>
                    <div className={styles.userDetails}>
                      <span className={styles.userName}>{app.user.name}</span>
                      <span className={styles.userEmail}>{app.user.email}</span>
                    </div>
                  </div>
                </td>

                {/* Application Info Cell */}
                <td>
                  <div className={styles.intentContainer}>
                    <div className={styles.penNameBadge}>
                      <PenTool size={12} /> {app.penName}
                    </div>
                    <div className={styles.intentPreviewRow}>
                      <p className={styles.intentText}>
                        {app.writingIntent}
                      </p>
                      <button 
                        className={styles.readMoreBtn} 
                        onClick={() => setIntentToView(app)}
                      >
                        Read Full
                      </button>
                    </div>
                  </div>
                </td>

                {/* Document Cell */}
                <td>
                  {app.documentUrl ? (
                    <a 
                      href={resolveDocumentUrl(app.documentUrl)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.docLink}
                    >
                      <FileText size={14} />
                      View Proof
                      <ExternalLink size={12} className={styles.linkIcon} />
                    </a>
                  ) : (
                    <span className={styles.noDoc}>No Document Attached</span>
                  )}
                </td>

                {/* Actions Cell */}
                <td>
                  <div className={styles.actionsContainer}>
                    <button 
                      className={`${styles.actionBtn} ${styles.approveBtn}`}
                      onClick={() => handleReview(app.id, 'APPROVED')}
                      disabled={reviewMutation.isPending}
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.rejectBtn}`}
                      onClick={() => handleReview(app.id, 'REJECTED')}
                      disabled={reviewMutation.isPending}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full Intent Modal */}
      <IntentModal 
        application={intentToView} 
        onClose={() => setIntentToView(null)} 
      />

      {/* Review Modal */}
      {reviewConfig && (
        <WarningModal
          heading={`${reviewConfig.status === 'APPROVED' ? 'Approve' : 'Reject'} Application?`}
          message={`Are you sure you want to ${reviewConfig.status.toLowerCase()} this user's application to become an author?`}
          onConfirm={() => {
            reviewMutation.mutate(
              { applicationId: reviewConfig.applicationId, status: reviewConfig.status },
              { onSettled: () => setReviewConfig(null) }
            );
          }}
          onClose={() => setReviewConfig(null)}
          isPending={reviewMutation.isPending}
          confirmText={reviewConfig.status === 'APPROVED' ? 'Approve Author' : 'Reject Application'}
          pendingText="Processing..."
        />
      )}
    </section>
  );
};