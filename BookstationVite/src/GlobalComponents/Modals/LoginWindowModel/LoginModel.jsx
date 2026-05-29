import { useNavigate } from 'react-router-dom';
import styles from './LoginModel.module.css';

function LoginModel({ OpenLogIn, onClose }) {
    const navigate = useNavigate();

    if (!OpenLogIn) return null;

    const onLogin = () => {
        navigate('/login');
    };

    return (
        <div className={styles.overlay} onClick={onClose} role="presentation">
            <div 
                className={styles.modal} 
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-modal-heading"
            >
                <h2 id="login-modal-heading" className={styles.heading}>Login Required</h2>
                <p className={styles.message}>
                    Login or sign up to dive into a world full of books.
                </p>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className={styles.loginBtn} onClick={onLogin}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginModel;
