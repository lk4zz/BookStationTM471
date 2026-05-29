import React from 'react';
import { useApplyAuthor, useApplicationStatus } from '../../../../../hooks/UserHooks/useApplyAuthor';
import styles from './AuthorApplicationView.module.css'; 

const AuthorApplicationView = ({ currentUser, onClose }) => {
    // Fetch the database status on load
    const { data: statusData, isLoading: isStatusLoading } = useApplicationStatus();
    
    const {
        formData,
        isLoading, // This is the submission loading state
        error,
        isSuccess,
        handleChange,
        handleFileChange,
        handleSubmit
    } = useApplyAuthor();

    // Prevent clicks inside the modal from closing it
    const stopPropagation = (e) => e.stopPropagation();

    const renderContent = () => {
        // 1. Show a loading state while we check the database for pending applications
        if (isStatusLoading) {
            return (
                <div className={styles.body}>
                    <p className={styles.centerText}>Loading application status...</p>
                </div>
            );
        }

        // 2. Check BOTH the local session success AND the database status
        if (isSuccess || statusData?.status === 'PENDING') {
            return (
                <div className={styles.body}>
                    <p className={styles.centerText}>
                        Your request to become an author is currently under review by our Admin team. 
                        We will notify you once a decision is made.
                    </p>
                    <div className={styles.actions}>
                        <button type="button" className={styles.closeBtn} onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            );
        }

        if (statusData?.status && statusData.status !== 'PENDING' && statusData.status !== 'NOT_SUBMITTED') {
            return (
                <div className={styles.body}>
                    <p className={styles.centerText}>
                        Your application has been {statusData.status.toLowerCase()}.<br/>
                        You may contact us to appeal on BookStation@hotmail.com
                    </p>
                    <div className={styles.actions}>
                        <button type="button" className={styles.closeBtn} onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            );
        }

        // 3. If neither are true, show the application form
        return (
            <div className={styles.body}>
                <p className={styles.centerText}>Fill out the details below to unlock the writing dashboard.</p>
                <form onSubmit={handleSubmit} className={styles.applicationForm}>
                    <label className={styles.inputGroup}>
                        Pen Name
                        <input 
                            type="text" 
                            name="penName"
                            className={styles.textInput}
                            value={formData.penName}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </label>

                    <label className={styles.inputGroup}>
                        Writing Intent (What genres/topics?)
                        <textarea 
                            name="writingIntent"
                            className={styles.textArea}
                            value={formData.writingIntent}
                            onChange={handleChange}
                            required
                            rows="4"
                            disabled={isLoading}
                        />
                    </label>

                    <label className={styles.checkboxGroup}>
                        <input 
                            type="checkbox" 
                            name="claimsExpertise"
                            checked={formData.claimsExpertise}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        I plan to write educational/specialized content (requires credentials)
                    </label>

                    {formData.claimsExpertise && (
                        <label className={styles.inputGroup}>
                            Upload Proof of Credentials (PDF/Image)
                            <input 
                                type="file" 
                                className={styles.fileInput}
                                accept=".pdf, .jpg, .png, .jpeg" 
                                onChange={handleFileChange} 
                                required={formData.claimsExpertise}
                                disabled={isLoading}
                            />
                        </label>
                    )}

                    <label className={styles.checkboxGroup}>
                        <input 
                            type="checkbox" 
                            name="agreedToPolicy"
                            checked={formData.agreedToPolicy}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        I agree to BookStation's Copyright & Content Policies
                    </label>

                    {error && <p className={styles.errorMessage}>{error.response?.data?.message || "Something went wrong"}</p>}

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading || !formData.agreedToPolicy} className={styles.submitBtn}>
                            {isLoading ? "Submitting..." : "Submit Application"}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    let headingText = "Apply to be an Author";
    if (!isStatusLoading) {
        if (isSuccess || statusData?.status === 'PENDING') {
            headingText = "Application Pending";
        } else if (statusData?.status && statusData.status !== 'NOT_SUBMITTED') {
            headingText = "Application Status";
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose} role="presentation">
            <div
                className={styles.modal}
                onClick={stopPropagation}
                role="dialog"
                aria-modal="true"
                aria-labelledby="author-application-modal-heading"
            >
                <h2 id="author-application-modal-heading" className={styles.heading}>
                    {headingText}
                </h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default AuthorApplicationView;
