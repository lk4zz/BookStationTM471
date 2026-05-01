import React from 'react';
import { useApplyAuthor, useApplicationStatus } from '../../../../hooks/useApplyAuthor';
import styles from './AuthorApplicationView.module.css'; 

const AuthorApplicationView = () => {
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

    // 1. Show a loading state while we check the database for pending applications
    if (isStatusLoading) {
        return (
            <div className={styles.formContainer} style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <div className="loading">Loading...</div>
            </div>
        );
    }
    console.log(statusData);

    // 2. Check BOTH the local session success AND the database status
    if (isSuccess || statusData?.status === 'PENDING') {
        return (
            <div className={styles.successContainer}>
                <h2>Application Pending</h2>
                <p>Your request to become an author is currently under review by our Admin team. We will notify you once a decision is made.</p>
            </div>
        );
    }

    if (statusData?.status === 'REJECTED') {
        return (
            <div className={styles.successContainer}>
                <h2>Application Rejected</h2>
                <p>You may contact us to appeal on BookStation@hotmail.com</p>
                </div>
        )
    }

    // 3. If neither are true, show the application form
    return (
        <div className={styles.formContainer}>
            <h2>Apply to be an Author</h2>
            <p>Fill out the details below to unlock the writing dashboard.</p>

            <form onSubmit={handleSubmit} className={styles.applicationForm}>
                
                <label className={styles.inputGroup}>
                    Pen Name
                    <input 
                        type="text" 
                        name="penName"
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

                <button type="submit" disabled={isLoading || !formData.agreedToPolicy} className={styles.submitBtn}>
                    {isLoading ? "Submitting..." : "Submit Application"}
                </button>
            </form>
        </div>
    );
};

export default AuthorApplicationView;