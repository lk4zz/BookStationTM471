import { useNotifications, useMarkNotificationAsRead } from "../../../hooks/UserHooks/useNotifications";
import styles from "./NotificationWindow.module.css";

function NotificationWindow() {
    const { notifications, isNotificationsLoading, notificationsError } = useNotifications();
    const { mutate: markAsRead } = useMarkNotificationAsRead();

    if (isNotificationsLoading) {
        return (
            <div className={styles.modalContainer}>
                <p className={styles.statusMessage}>Loading notifications...</p>
            </div>
        );
    }

    if (notificationsError) {
        return (
            <div className={styles.modalContainer}>
                <p className={styles.statusMessage}>Failed to load notifications.</p>
            </div>
        );
    }

    const handleNotificationClick = (id, isRead) => {
        if (!isRead) {
            markAsRead(id);
        }
    };

    const getCardClassName = (isRead) => {
        if (isRead) {
            return `${styles.notificationCard} ${styles.read}`;
        }
        return `${styles.notificationCard} ${styles.unread}`;
    };

    return (
        <div className={styles.modalContainer}>
            <div className={styles.header}>
                <h3>Inbox</h3>
            </div>
            
            <div className={styles.list}>
                {notifications.length === 0 && (
                    <p className={styles.statusMessage}>You have no new notifications.</p>
                )}

                {notifications.length > 0 && notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={getCardClassName(notif.isRead)}
                        
                    >
                        <div className={styles.cardHeader}>
                            <h4 className={styles.title}>{notif.title}</h4>
                            <span className={styles.date}>
                                {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                            
                        </div>
                        <p className={styles.message}>{notif.message}</p>
                        <button
                            className={styles.readButton}
                            onClick={() => handleNotificationClick(notif.id, notif.isRead)}
                        >Mark as read</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationWindow;