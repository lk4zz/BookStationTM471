import styles from './LoginModel.module.css'
import { useNavigate } from 'react-router-dom';

function LoginModel({ OpenLogIn, onClose }) {

    if (!OpenLogIn) return null;
    const navigate = useNavigate()
    const onLogin = () => {
        console.log("on login is working")
        navigate('/login')
    }
    return (
        <div className={styles.modaloverlay}>
            <div className={styles.modalcontent}>
                <h2>Login requried!</h2>
                <p>Login in or signup  <br /><br /> Dive into a world full of books </p>


                <div className={styles.modalactions}>
                    <button className={styles.btnunlock} onClick={() => onLogin()}>
                        Login
                    </button>
                    <button className={styles.btncancel} onClick={onClose}>
                        Cancel
                    </button>

                </div>
            </div>
        </div>
    );
}

export default LoginModel;